// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ILoreEpochs} from "./interfaces/ILoreEpochs.sol";
import {LoreNFT} from "./LoreNFT.sol";

/**
 * @title LoreEpochRegistry — stores epoch roots and updates collection-wide baseUriEpoch
 * @notice Pipeline:
 *  1) Off-chain: build per-epoch IPFS directory with `<tokenId>.json` and Merkle leaves/proofs.
 *  2) Off-chain: compute epoch root (bytes32) and get new `ipfs://<CID_epoch>/`.
 *  3) On-chain: call `commitEpoch(root, newBase, fromTs, toTs, rangeFrom, rangeTo)`.
 *  4) Registry stores epoch data, updates NFT baseUriEpoch, emits EIP-4906 batch signal.
 */
contract LoreEpochRegistry is ILoreEpochs, AccessControl {
    // Roles
    bytes32 public constant GAME_ROLE   = keccak256("GAME_ROLE");   // allowed to commit epochs
    bytes32 public constant NFT_MANAGER = keccak256("NFT_MANAGER"); // optional manager role if you add more hooks

    // epochId => epoch data
    mapping(uint64 => Epoch) private _epochs;
    uint64 private _currentEpoch;

    // Target NFT collection to update baseUriEpoch and emit EIP-4906
    LoreNFT public immutable nft;

    event EpochCommitted(
        uint64 indexed epochId,
        bytes32 indexed root,
        uint64 fromTs,
        uint64 toTs,
        string baseUriEpoch
    );

    /**
     * @notice Constructor for LoreEpochRegistry.
     * @param admin Receives DEFAULT_ADMIN_ROLE and can grant GAME_ROLE and set NFT roles on the NFT contract.
     * @param nft_ Target NFT collection (must grant this registry REGISTRY_ROLE on the NFT before calling commitEpoch).
     */
    constructor(address admin, LoreNFT nft_) {
        require(admin != address(0), "LoreEpochRegistry: admin=0");
        require(address(nft_) != address(0), "LoreEpochRegistry: nft=0");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(GAME_ROLE, admin);
        _grantRole(NFT_MANAGER, admin);
        nft = nft_;
    }

    /// @notice Commit a new epoch: update on-chain root, set new IPFS baseUriEpoch on the NFT, and emit EIP-4906 batch event.
    /// @dev The NFT contract must have granted this registry the REGISTRY_ROLE beforehand.
    /// @param root Merkle/hash root of the epoch payloads (used for off-chain verification).
    /// @param newBaseUriEpoch IPFS directory CID for this epoch, e.g., "ipfs://bafy.../".
    /// @param fromTs Inclusive UNIX start of the epoch.
    /// @param toTs Inclusive UNIX end of the epoch.
    /// @param batchFromTokenId Lower bound for EIP-4906 batch hint (inclusive).
    /// @param batchToTokenId Upper bound for EIP-4906 batch hint (inclusive).
    function commitEpoch(
        bytes32 root,
        string calldata newBaseUriEpoch,
        uint64 fromTs,
        uint64 toTs,
        uint256 batchFromTokenId,
        uint256 batchToTokenId
    ) external onlyRole(GAME_ROLE) {
        require(root != bytes32(0), "LoreEpochRegistry: root=0");
        require(bytes(newBaseUriEpoch).length > 0, "LoreEpochRegistry: empty base");
        require(fromTs <= toTs, "LoreEpochRegistry: ts order");

        /** Check for epoch overlap with previous epoch */
        if (_currentEpoch > 0) {
            Epoch memory prev = _epochs[_currentEpoch];
            require(fromTs > prev.toTs, "LoreEpochRegistry: epoch overlap");
        }

        uint64 next = _currentEpoch + 1;
        _epochs[next] = Epoch({root: root, fromTs: fromTs, toTs: toTs, baseUri: newBaseUriEpoch});
        _currentEpoch = next;

        // Update NFT base URI for the epoch and emit EIP-4906 batch notification
        nft.setBaseUriEpoch(newBaseUriEpoch);
        nft.emitBatchMetadataUpdate(batchFromTokenId, batchToTokenId);

        emit EpochCommitted(next, root, fromTs, toTs, newBaseUriEpoch);
    }

    /**
     * @notice Get the current epoch ID.
     * @return The current epoch ID.
     */
    function currentEpoch() external view returns (uint64) {
        return _currentEpoch;
    }

    /**
     * @notice Get epoch data by epoch ID.
     * @param epochId The epoch ID to query.
     * @return root The Merkle root of the epoch.
     * @return fromTs The start timestamp of the epoch.
     * @return toTs The end timestamp of the epoch.
     * @return baseUri The IPFS base URI for the epoch.
     */
    function epochs(uint64 epochId)
        external
        view
        returns (bytes32 root, uint64 fromTs, uint64 toTs, string memory baseUri)
    {
        Epoch memory e = _epochs[epochId];
        return (e.root, e.fromTs, e.toTs, e.baseUri);
    }
}
