// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {AccessControl} from '@openzeppelin/contracts/access/AccessControl.sol';
import {EIP712} from '@openzeppelin/contracts/utils/cryptography/EIP712.sol';
import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

import {IERC165} from '@openzeppelin/contracts/utils/introspection/IERC165.sol';
import {IERC4906} from '@openzeppelin/contracts/interfaces/IERC4906.sol';
import {ILoreEpochs} from './interfaces/ILoreEpochs.sol';

import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';

/**
 * @title LoreNFT (game skins mirror) — IPFS metadata by epoch + EIP-4906
 * @dev tokenURI(id) = baseUriEpoch + id + ".json", where baseUriEpoch points to an IPFS directory for the current epoch.
 *      All game attributes (weapon, skin, rarity, wear, paint seed, stickers, StatTrak, kills, matches, etc.) live inside IPFS JSON.
 *      On-chain contract stores only the shared baseUriEpoch and (optionally) an epochs registry.
 *      Transfers are only allowed via backend signature (EIP-712).
 */
contract LoreNFT is ERC721, AccessControl, EIP712, IERC4906 {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');
    bytes32 public constant REGISTRY_ROLE = keccak256('REGISTRY_ROLE'); // allowed to change baseUriEpoch and emit 4906

    // Dynamic (per-epoch) base URI, updated by the registry on each commit.
    string public baseUriEpoch;

    // Optional reference to an epochs registry (for UIs to read roots/timeframes)
    ILoreEpochs public loreRegistry;

    // Backend signer address for transfer authorization
    address public backendSigner;

    // Used signatures for replay protection (hash => used)
    mapping(bytes32 => bool) public completedTransfers;

    // EIP-712 TypeHash for transfer
    bytes32 public constant TRANSFER_TYPEHASH = 
        keccak256("Transfer(address from,address to,uint256 tokenId,uint256 nonce,uint256 deadline)");

    uint256 private _nextId = 1;

    // Flag to enable/disable free transfers (without signature)
    bool public transfersEnabled;

    // Internal flag to temporarily allow transfer during transferWithSignature
    bool private _transferInProgress;

    event SetBaseUriEpoch(string newBaseUriEpoch);
    event SetLoreRegistry(address indexed reg);
    event SetBackendSigner(address indexed newSigner);
    event SetTransfersEnabled(bool enabled);
    event TransferWithSignature(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @param name_ Collection name.
     * @param symbol_ Collection symbol.
     * @param admin Address that receives DEFAULT_ADMIN_ROLE and can grant other roles.
     * @param initialBaseUriEpoch Initial IPFS directory for token JSON, e.g. "ipfs://CID/".
     * @param reg Optional epochs registry; pass address(0) if not used.
     * @param backendSigner_ Address of the backend signer for transfer authorization.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        address admin,
        string memory initialBaseUriEpoch,
        ILoreEpochs reg,
        address backendSigner_
    ) ERC721(name_, symbol_) EIP712(name_, "1.0") {
        require(bytes(name_).length != 0, 'name_: empty');
        require(bytes(symbol_).length != 0, 'symbol_: empty');
        require(admin != address(0), 'admin: address(0)');
        require(bytes(initialBaseUriEpoch).length != 0, 'initialBaseUriEpoch: empty');
        require(address(reg) != address(0), 'reg: address(0)');
        require(backendSigner_ != address(0), 'backendSigner_: address(0)');

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(REGISTRY_ROLE, admin);

        baseUriEpoch = initialBaseUriEpoch; // ipfs://CID_epoch/
        loreRegistry = reg;
        backendSigner = backendSigner_;
    }

    /**
     * @notice Mint with auto-incremented token id.
     * @param to Address to mint the token to.
     * @return tokenId The token ID.
     */
    function mint(
        address to
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        tokenId = _nextId++;
        _safeMint(to, tokenId);
        emit MetadataUpdate(tokenId); // allow indexers/markets to refresh initial card
    }

    /**
     * @notice Batch mint tokens to multiple addresses.
     * @param to Addresses to mint the tokens to.
     * @return tokenIds The token IDs.
     */
    function batchMint(
        address[] calldata to
    ) external onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        require(to.length != 0, 'to: empty');

        uint256[] memory tokenIds = new uint256[](to.length);
        for (uint256 i = 0; i < to.length; ) {
            tokenIds[i] = _nextId++;
            _safeMint(to[i], tokenIds[i]);

            unchecked {
                ++i;
            }
        }

        emit BatchMetadataUpdate(tokenIds[0], tokenIds[tokenIds.length - 1]);
        return tokenIds;
    }

    /**
     * @notice Set the backend signer address for transfer authorization.
     * @param newSigner New backend signer address.
     */
    function setBackendSigner(address newSigner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newSigner != address(0), 'newSigner: address(0)');
        require(newSigner != backendSigner, 'newSigner: duplicate');
        
        backendSigner = newSigner;
        emit SetBackendSigner(newSigner);
    }

    /**
     * @notice Enable or disable free transfers without signature.
     * @param enabled True to enable free transfers, false to require signature.
     */
    function setTransfersEnabled(bool enabled) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(enabled != transfersEnabled, 'transfersEnabled: duplicate');
        
        transfersEnabled = enabled;
        emit SetTransfersEnabled(enabled);
    }

    /**
     * @notice Transfer a token with backend signature authorization.
     * @param from Current owner of the token.
     * @param to Recipient of the token.
     * @param tokenId Token ID to transfer.
     * @param nonce Unique nonce provided by backend.
     * @param deadline Signature expiration timestamp.
     * @param signature EIP-712 signature from backend.
     */
    function transferWithSignature(
        address from,
        address to,
        uint256 tokenId,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external {
        require(block.timestamp <= deadline, 'signature expired');
        require(ownerOf(tokenId) == from, 'from is not owner');

        // Build EIP-712 hash
        bytes32 structHash = keccak256(
            abi.encode(
                TRANSFER_TYPEHASH,
                from,
                to,
                tokenId,
                nonce,
                deadline
            )
        );
        bytes32 hash = _hashTypedDataV4(structHash);

        // Check signature not used
        require(!completedTransfers[hash], 'transfer already fulfilled');

        // Verify signature
        address signer = ECDSA.recover(hash, signature);
        require(signer == backendSigner, 'invalid signature');

        // Mark signature as used
        completedTransfers[hash] = true;

        // Allow transfer and execute
        _transferInProgress = true;
        _transfer(from, to, tokenId);
        _transferInProgress = false;

        emit TransferWithSignature(from, to, tokenId);
    }

    /**
     * @notice Set the collection-wide base URI for the current epoch (ipfs://<CID_epoch>/).
     * @dev Must be called by a trusted registry/manager after uploading new JSON snapshots to IPFS.
     * @param newBase New base URI.
     */
    function setBaseUriEpoch(
        string calldata newBase
    ) external onlyRole(REGISTRY_ROLE) {
        require(bytes(newBase).length != 0, 'newBase: empty');
        require(keccak256(abi.encodePacked(newBase)) != keccak256(abi.encodePacked(baseUriEpoch)), 'newBase: duplicate');

        baseUriEpoch = newBase;
        emit SetBaseUriEpoch(newBase);
    }

    /**
     * @notice Optionally set/replace the epochs registry pointer (read-only from NFT side).
     * @param reg Epochs registry address.
     */
    function setLoreRegistry(
        ILoreEpochs reg
    ) external onlyRole(REGISTRY_ROLE) {
        require(address(reg) != address(0), 'reg: address(0)');
        require(address(reg) != address(loreRegistry), 'reg: duplicate');

        loreRegistry = reg;
        emit SetLoreRegistry(address(reg));
    }

    /**
     * @notice Emit a batch metadata update event (EIP-4906).
     * @param fromTokenId The first token ID in the batch.
     * @param toTokenId The last token ID in the batch.
     */
    function emitBatchMetadataUpdate(
        uint256 fromTokenId,
        uint256 toTokenId
    ) external onlyRole(REGISTRY_ROLE) {
        emit BatchMetadataUpdate(fromTokenId, toTokenId);
    }

    /**
     * @notice Get the token URI for a specific token.
     * @param tokenId The token ID.
     * @return The token URI (format: ipfs://<CID_epoch>/<tokenId>.json).
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), 'LoreNFT: nonexistent token');
        return string.concat(baseUriEpoch, tokenId.toString(), '.json');
    }

    /**
     * @notice Get the token URI at a specific epoch.
     * @param tokenId The token ID.
     * @param epochId The epoch ID.
     * @return The token URI at the epoch (format: ipfs://<CID_epoch>/<tokenId>.json).
     */
    function tokenURIAtEpoch(uint256 tokenId, uint64 epochId) public view returns (string memory) {
        require(_exists(tokenId), "no token");
        require(address(loreRegistry) != address(0), "no registry");
        (, , , string memory epochBase) = loreRegistry.epochs(epochId);
        require(bytes(epochBase).length != 0, "epoch not found");
        return string.concat(epochBase, tokenId.toString(), '.json');
    }

    /**
     * @return The maximum minted token ID.
     */
    function maxMintedId() external view returns (uint256) {
        return _nextId - 1;
    }

    /**
     * @dev Hook that is called before any token transfer. Blocks regular transfers unless authorized.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        if (from == address(0) || to == address(0)) {
            return;
        }
        
        // Allow if transfers are enabled globally or if signature transfer is in progress
        require(
            transfersEnabled || _transferInProgress,
            'transfers are disabled, use transferWithSignature'
        );
    }

    /**
     * @param iid The interface ID.
     * @return True if the interface is supported.
     */
    function supportsInterface(
        bytes4 iid
    )
        public
        view
        override(ERC721, AccessControl, IERC165)
        returns (bool)
    {
        return
            iid == type(IERC4906).interfaceId ||
            super.supportsInterface(iid);
    }
}
