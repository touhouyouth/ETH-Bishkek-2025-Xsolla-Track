// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "forge-std/Test.sol";
import "../src/LoreNFT.sol";
import "../src/LoreEpochRegistry.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract LoreNFTTest is Test {
    LoreNFT public nft;
    LoreEpochRegistry public registry;
    
    address public admin = address(1);
    address public minter = address(2);
    address public user1 = address(3);
    address public user2 = address(4);
    address public backendSigner;
    uint256 public backendSignerPrivateKey;
    
    string constant NAME = "Lore NFT";
    string constant SYMBOL = "LORE";
    string constant INITIAL_BASE_URI = "ipfs://QmInitialCID/";
    
    event SetBaseUriEpoch(string newBaseUriEpoch);
    event SetLoreRegistry(address indexed reg);
    event SetBackendSigner(address indexed newSigner);
    event SetTransfersEnabled(bool enabled);
    event TransferWithSignature(address indexed from, address indexed to, uint256 indexed tokenId);
    event MetadataUpdate(uint256 _tokenId);
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
    
    function setUp() public {
        // Generate backend signer key pair
        backendSignerPrivateKey = 0xA11CE;
        backendSigner = vm.addr(backendSignerPrivateKey);
        
        vm.startPrank(admin);
        
        // Deploy registry first
        registry = new LoreEpochRegistry(admin, LoreNFT(address(1))); // Temporary address
        
        // Deploy NFT
        nft = new LoreNFT(
            NAME,
            SYMBOL,
            admin,
            INITIAL_BASE_URI,
            ILoreEpochs(address(registry)),
            backendSigner
        );
        
        // Deploy registry with correct NFT address
        registry = new LoreEpochRegistry(admin, nft);
        
        // Update NFT to use the correct registry
        nft.setLoreRegistry(ILoreEpochs(address(registry)));
        
        // Grant registry role to registry contract
        nft.grantRole(nft.REGISTRY_ROLE(), address(registry));
        
        // Grant minter role to minter address
        nft.grantRole(nft.MINTER_ROLE(), minter);
        
        vm.stopPrank();
    }
    
    // Helper function to compute domain separator
    function _getDomainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(NAME)),
                keccak256(bytes("1.0")),
                block.chainid,
                address(nft)
            )
        );
    }
    
    // ============ Constructor Tests ============
    
    function testConstructor() public {
        assertEq(nft.name(), NAME);
        assertEq(nft.symbol(), SYMBOL);
        assertEq(nft.baseUriEpoch(), INITIAL_BASE_URI);
        assertEq(address(nft.loreRegistry()), address(registry));
        assertEq(nft.backendSigner(), backendSigner);
        assertTrue(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(nft.hasRole(nft.MINTER_ROLE(), admin));
        assertTrue(nft.hasRole(nft.REGISTRY_ROLE(), admin));
        assertFalse(nft.transfersEnabled());
    }
    
    function test_RevertWhen_ConstructorWithEmptyName() public {
        vm.prank(admin);
        vm.expectRevert("name_: empty");
        new LoreNFT("", SYMBOL, admin, INITIAL_BASE_URI, ILoreEpochs(address(registry)), backendSigner);
    }
    
    function test_RevertWhen_ConstructorWithEmptySymbol() public {
        vm.prank(admin);
        vm.expectRevert("symbol_: empty");
        new LoreNFT(NAME, "", admin, INITIAL_BASE_URI, ILoreEpochs(address(registry)), backendSigner);
    }
    
    function test_RevertWhen_ConstructorWithZeroAdmin() public {
        vm.prank(admin);
        vm.expectRevert("admin: address(0)");
        new LoreNFT(NAME, SYMBOL, address(0), INITIAL_BASE_URI, ILoreEpochs(address(registry)), backendSigner);
    }
    
    function test_RevertWhen_ConstructorWithEmptyBaseURI() public {
        vm.prank(admin);
        vm.expectRevert("initialBaseUriEpoch: empty");
        new LoreNFT(NAME, SYMBOL, admin, "", ILoreEpochs(address(registry)), backendSigner);
    }
    
    function test_RevertWhen_ConstructorWithZeroRegistry() public {
        vm.prank(admin);
        vm.expectRevert("reg: address(0)");
        new LoreNFT(NAME, SYMBOL, admin, INITIAL_BASE_URI, ILoreEpochs(address(0)), backendSigner);
    }
    
    function test_RevertWhen_ConstructorWithZeroBackendSigner() public {
        vm.prank(admin);
        vm.expectRevert("backendSigner_: address(0)");
        new LoreNFT(NAME, SYMBOL, admin, INITIAL_BASE_URI, ILoreEpochs(address(registry)), address(0));
    }
    
    // ============ Minting Tests ============
    
    function testMint() public {
        uint256 tokenId = 1;
        
        vm.prank(minter);
        vm.expectEmit(true, false, false, false);
        emit MetadataUpdate(tokenId);
        nft.mint(user1, tokenId);
        
        assertEq(nft.ownerOf(tokenId), user1);
        assertEq(nft.totalSupply(), 1);
        assertEq(nft.balanceOf(user1), 1);
    }
    
    function test_RevertWhen_MintTokenIdZero() public {
        vm.prank(minter);
        vm.expectRevert("tokenId: cannot be 0");
        nft.mint(user1, 0);
    }
    
    function test_RevertWhen_MintExistingToken() public {
        uint256 tokenId = 1;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        vm.prank(minter);
        vm.expectRevert("tokenId: already exists");
        nft.mint(user2, tokenId);
    }
    
    function test_RevertWhen_NonMinterMints() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.mint(user1, 1);
    }
    
    function testBatchMint() public {
        address[] memory recipients = new address[](3);
        recipients[0] = user1;
        recipients[1] = user1;
        recipients[2] = user2;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        vm.prank(minter);
        vm.expectEmit(true, true, false, false);
        emit BatchMetadataUpdate(1, 3);
        nft.batchMint(recipients, tokenIds);
        
        assertEq(nft.ownerOf(1), user1);
        assertEq(nft.ownerOf(2), user1);
        assertEq(nft.ownerOf(3), user2);
        assertEq(nft.totalSupply(), 3);
        assertEq(nft.balanceOf(user1), 2);
        assertEq(nft.balanceOf(user2), 1);
    }
    
    function test_RevertWhen_BatchMintEmptyArray() public {
        address[] memory recipients = new address[](0);
        uint256[] memory tokenIds = new uint256[](0);
        
        vm.prank(minter);
        vm.expectRevert("to: empty");
        nft.batchMint(recipients, tokenIds);
    }
    
    function test_RevertWhen_BatchMintArrayLengthMismatch() public {
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;
        
        uint256[] memory tokenIds = new uint256[](3);
        tokenIds[0] = 1;
        tokenIds[1] = 2;
        tokenIds[2] = 3;
        
        vm.prank(minter);
        vm.expectRevert("tokenIds and to length mismatch");
        nft.batchMint(recipients, tokenIds);
    }
    
    function test_RevertWhen_BatchMintWithZeroTokenId() public {
        address[] memory recipients = new address[](2);
        recipients[0] = user1;
        recipients[1] = user2;
        
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 1;
        tokenIds[1] = 0;
        
        vm.prank(minter);
        vm.expectRevert("tokenId: cannot be 0");
        nft.batchMint(recipients, tokenIds);
    }
    
    // ============ Backend Signer Tests ============
    
    function testSetBackendSigner() public {
        address newSigner = address(0x999);
        
        vm.prank(admin);
        vm.expectEmit(true, false, false, false);
        emit SetBackendSigner(newSigner);
        nft.setBackendSigner(newSigner);
        
        assertEq(nft.backendSigner(), newSigner);
    }
    
    function test_RevertWhen_SetBackendSignerToZero() public {
        vm.prank(admin);
        vm.expectRevert("newSigner: address(0)");
        nft.setBackendSigner(address(0));
    }
    
    function test_RevertWhen_SetBackendSignerToDuplicate() public {
        vm.prank(admin);
        vm.expectRevert("newSigner: duplicate");
        nft.setBackendSigner(backendSigner);
    }
    
    function test_RevertWhen_NonAdminSetsBackendSigner() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.setBackendSigner(address(0x999));
    }
    
    // ============ Transfers Enabled Tests ============
    
    function testSetTransfersEnabled() public {
        vm.prank(admin);
        vm.expectEmit(true, false, false, false);
        emit SetTransfersEnabled(true);
        nft.setTransfersEnabled(true);
        
        assertTrue(nft.transfersEnabled());
    }
    
    function test_RevertWhen_SetTransfersEnabledToDuplicate() public {
        vm.prank(admin);
        vm.expectRevert("transfersEnabled: duplicate");
        nft.setTransfersEnabled(false);
    }
    
    function test_RevertWhen_NonAdminSetsTransfersEnabled() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.setTransfersEnabled(true);
    }
    
    function testTransferWhenEnabled() public {
        // Mint token
        vm.prank(minter);
        nft.mint(user1, 1);
        
        // Enable transfers
        vm.prank(admin);
        nft.setTransfersEnabled(true);
        
        // Transfer
        vm.prank(user1);
        nft.transferFrom(user1, user2, 1);
        
        assertEq(nft.ownerOf(1), user2);
    }
    
    function test_RevertWhen_TransferWhenDisabled() public {
        // Mint token
        vm.prank(minter);
        nft.mint(user1, 1);
        
        // Try to transfer (should fail)
        vm.prank(user1);
        vm.expectRevert("transfers are disabled, use transferWithSignature");
        nft.transferFrom(user1, user2, 1);
    }
    
    // ============ Transfer With Signature Tests ============
    
    function testTransferWithSignature() public {
        uint256 tokenId = 1;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        
        // Mint token to user1
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        // Create signature
        bytes32 structHash = keccak256(
            abi.encode(
                nft.TRANSFER_TYPEHASH(),
                user1,
                user2,
                tokenId,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _getDomainSeparator(),
                structHash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendSignerPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        // Execute transfer with signature
        vm.expectEmit(true, true, true, false);
        emit TransferWithSignature(user1, user2, tokenId);
        nft.transferWithSignature(user1, user2, tokenId, nonce, deadline, signature);
        
        assertEq(nft.ownerOf(tokenId), user2);
        assertTrue(nft.completedTransfers(digest));
    }
    
    function test_RevertWhen_TransferWithExpiredSignature() public {
        uint256 tokenId = 1;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp - 1;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        bytes32 structHash = keccak256(
            abi.encode(
                nft.TRANSFER_TYPEHASH(),
                user1,
                user2,
                tokenId,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _getDomainSeparator(),
                structHash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendSignerPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.expectRevert("signature expired");
        nft.transferWithSignature(user1, user2, tokenId, nonce, deadline, signature);
    }
    
    function test_RevertWhen_TransferWithInvalidSigner() public {
        uint256 tokenId = 1;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        bytes32 structHash = keccak256(
            abi.encode(
                nft.TRANSFER_TYPEHASH(),
                user1,
                user2,
                tokenId,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _getDomainSeparator(),
                structHash
            )
        );
        
        // Sign with wrong private key
        uint256 wrongPrivateKey = 0xBAD;
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.expectRevert("invalid signature");
        nft.transferWithSignature(user1, user2, tokenId, nonce, deadline, signature);
    }
    
    function test_RevertWhen_TransferWithReusedSignature() public {
        uint256 tokenId = 1;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        bytes32 structHash = keccak256(
            abi.encode(
                nft.TRANSFER_TYPEHASH(),
                user1,
                user2,
                tokenId,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _getDomainSeparator(),
                structHash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendSignerPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        // First transfer succeeds
        nft.transferWithSignature(user1, user2, tokenId, nonce, deadline, signature);
        
        // Transfer back to user1 to test signature reuse
        vm.prank(admin);
        nft.setTransfersEnabled(true);
        vm.prank(user2);
        nft.transferFrom(user2, user1, tokenId);
        vm.prank(admin);
        nft.setTransfersEnabled(false);
        
        // Try to reuse signature (should fail)
        vm.expectRevert("transfer already fulfilled");
        nft.transferWithSignature(user1, user2, tokenId, nonce, deadline, signature);
    }
    
    function test_RevertWhen_TransferFromWrongOwner() public {
        uint256 tokenId = 1;
        uint256 nonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        bytes32 structHash = keccak256(
            abi.encode(
                nft.TRANSFER_TYPEHASH(),
                user2, // Wrong owner
                user1,
                tokenId,
                nonce,
                deadline
            )
        );
        
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                _getDomainSeparator(),
                structHash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(backendSignerPrivateKey, digest);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.expectRevert("from is not owner");
        nft.transferWithSignature(user2, user1, tokenId, nonce, deadline, signature);
    }
    
    // ============ Base URI Tests ============
    
    function testSetBaseUriEpoch() public {
        string memory newBaseURI = "ipfs://QmNewCID/";
        
        vm.prank(admin);
        vm.expectEmit(true, false, false, true);
        emit SetBaseUriEpoch(newBaseURI);
        nft.setBaseUriEpoch(newBaseURI);
        
        assertEq(nft.baseUriEpoch(), newBaseURI);
    }
    
    function test_RevertWhen_SetBaseUriEpochEmpty() public {
        vm.prank(admin);
        vm.expectRevert("newBase: empty");
        nft.setBaseUriEpoch("");
    }
    
    function test_RevertWhen_SetBaseUriEpochDuplicate() public {
        vm.prank(admin);
        vm.expectRevert("newBase: duplicate");
        nft.setBaseUriEpoch(INITIAL_BASE_URI);
    }
    
    function test_RevertWhen_NonRegistryRoleSetsBaseUriEpoch() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.setBaseUriEpoch("ipfs://QmNewCID/");
    }
    
    // ============ Token URI Tests ============
    
    function testTokenURI() public {
        uint256 tokenId = 123;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        string memory expectedURI = string.concat(INITIAL_BASE_URI, "123.json");
        assertEq(nft.tokenURI(tokenId), expectedURI);
    }
    
    function test_RevertWhen_TokenURIForNonexistentToken() public {
        vm.expectRevert("LoreNFT: nonexistent token");
        nft.tokenURI(999);
    }
    
    function testTokenURIAtEpoch() public {
        uint256 tokenId = 123;
        
        // Mint token
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        // Commit an epoch
        vm.prank(admin);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        
        string memory expectedURI = string.concat("ipfs://QmEpoch1/", "123.json");
        assertEq(nft.tokenURIAtEpoch(tokenId, 1), expectedURI);
    }
    
    function test_RevertWhen_TokenURIAtEpochForNonexistentToken() public {
        vm.expectRevert("no token");
        nft.tokenURIAtEpoch(999, 1);
    }
    
    function test_RevertWhen_TokenURIAtEpochForInvalidEpoch() public {
        uint256 tokenId = 123;
        
        vm.prank(minter);
        nft.mint(user1, tokenId);
        
        vm.expectRevert("epoch not found");
        nft.tokenURIAtEpoch(tokenId, 999);
    }
    
    // ============ Registry Tests ============
    
    function testSetLoreRegistry() public {
        LoreEpochRegistry newRegistry = new LoreEpochRegistry(admin, nft);
        
        vm.prank(admin);
        vm.expectEmit(true, false, false, false);
        emit SetLoreRegistry(address(newRegistry));
        nft.setLoreRegistry(ILoreEpochs(address(newRegistry)));
        
        assertEq(address(nft.loreRegistry()), address(newRegistry));
    }
    
    function test_RevertWhen_SetLoreRegistryToZero() public {
        vm.prank(admin);
        vm.expectRevert("reg: address(0)");
        nft.setLoreRegistry(ILoreEpochs(address(0)));
    }
    
    function test_RevertWhen_SetLoreRegistryToDuplicate() public {
        vm.prank(admin);
        vm.expectRevert("reg: duplicate");
        nft.setLoreRegistry(ILoreEpochs(address(registry)));
    }
    
    function test_RevertWhen_NonRegistryRoleSetsLoreRegistry() public {
        LoreEpochRegistry newRegistry = new LoreEpochRegistry(admin, nft);
        
        vm.prank(user1);
        vm.expectRevert();
        nft.setLoreRegistry(ILoreEpochs(address(newRegistry)));
    }
    
    // ============ Batch Metadata Update Tests ============
    
    function testEmitBatchMetadataUpdate() public {
        vm.prank(admin);
        vm.expectEmit(true, true, false, false);
        emit BatchMetadataUpdate(1, 100);
        nft.emitBatchMetadataUpdate(1, 100);
    }
    
    function test_RevertWhen_NonRegistryRoleEmitsBatchMetadataUpdate() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.emitBatchMetadataUpdate(1, 100);
    }
    
    // ============ Tokens Of Owner Tests ============
    
    function testTokensOfOwner() public {
        // Mint multiple tokens
        vm.startPrank(minter);
        nft.mint(user1, 1);
        nft.mint(user1, 5);
        nft.mint(user1, 10);
        nft.mint(user2, 2);
        vm.stopPrank();
        
        uint256[] memory tokens = nft.tokensOfOwner(user1);
        
        assertEq(tokens.length, 3);
        assertEq(tokens[0], 1);
        assertEq(tokens[1], 5);
        assertEq(tokens[2], 10);
    }
    
    function testTokensOfOwnerEmpty() public {
        uint256[] memory tokens = nft.tokensOfOwner(user1);
        assertEq(tokens.length, 0);
    }
    
    // ============ Interface Support Tests ============
    
    function testSupportsInterface() public {
        // ERC721
        assertTrue(nft.supportsInterface(0x80ac58cd));
        // ERC721Enumerable
        assertTrue(nft.supportsInterface(0x780e9d63));
        // AccessControl
        assertTrue(nft.supportsInterface(type(IAccessControl).interfaceId));
        // ERC165
        assertTrue(nft.supportsInterface(type(IERC165).interfaceId));
    }
}

