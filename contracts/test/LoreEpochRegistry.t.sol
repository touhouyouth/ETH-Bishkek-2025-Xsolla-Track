// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "forge-std/Test.sol";
import "../src/LoreNFT.sol";
import "../src/LoreEpochRegistry.sol";

contract LoreEpochRegistryTest is Test {
    LoreNFT public nft;
    LoreEpochRegistry public registry;
    
    address public admin = address(1);
    address public gameBackend = address(2);
    address public user = address(3);
    address public backendSigner;
    uint256 public backendSignerPrivateKey;
    
    string constant NAME = "Lore NFT";
    string constant SYMBOL = "LORE";
    string constant INITIAL_BASE_URI = "ipfs://QmInitialCID/";
    
    event EpochCommitted(
        uint64 indexed epochId,
        bytes32 indexed root,
        uint64 fromTs,
        uint64 toTs,
        string baseUriEpoch
    );
    
    function setUp() public {
        // Generate backend signer key pair
        backendSignerPrivateKey = 0xA11CE;
        backendSigner = vm.addr(backendSignerPrivateKey);
        
        vm.startPrank(admin);
        
        // Deploy registry with temporary NFT address
        registry = new LoreEpochRegistry(admin, LoreNFT(address(1)));
        
        // Deploy NFT
        nft = new LoreNFT(
            NAME,
            SYMBOL,
            admin,
            INITIAL_BASE_URI,
            ILoreEpochs(address(1)), // Temporary registry
            backendSigner
        );
        
        // Deploy registry with correct NFT address
        registry = new LoreEpochRegistry(admin, nft);
        
        // Update NFT to use the correct registry
        nft.setLoreRegistry(ILoreEpochs(address(registry)));
        
        // Grant registry role to registry contract on NFT
        nft.grantRole(nft.REGISTRY_ROLE(), address(registry));
        
        // Grant game role to gameBackend
        registry.grantRole(registry.GAME_ROLE(), gameBackend);
        
        vm.stopPrank();
    }
    
    // ============ Constructor Tests ============
    
    function testConstructor() public {
        assertEq(address(registry.nft()), address(nft));
        assertTrue(registry.hasRole(registry.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(registry.hasRole(registry.GAME_ROLE(), admin));
        assertTrue(registry.hasRole(registry.NFT_MANAGER(), admin));
        assertEq(registry.currentEpoch(), 0);
    }
    
    function test_RevertWhen_ConstructorWithZeroAdmin() public {
        vm.expectRevert("LoreEpochRegistry: admin=0");
        new LoreEpochRegistry(address(0), nft);
    }
    
    function test_RevertWhen_ConstructorWithZeroNFT() public {
        vm.expectRevert("LoreEpochRegistry: nft=0");
        new LoreEpochRegistry(admin, LoreNFT(address(0)));
    }
    
    // ============ Commit Epoch Tests ============
    
    function testCommitEpoch() public {
        bytes32 root = bytes32(uint256(1));
        string memory baseUri = "ipfs://QmEpoch1/";
        uint64 fromTs = uint64(block.timestamp);
        uint64 toTs = uint64(block.timestamp + 1 days);
        uint256 batchFrom = 1;
        uint256 batchTo = 1000;
        
        vm.prank(gameBackend);
        vm.expectEmit(true, true, false, true);
        emit EpochCommitted(1, root, fromTs, toTs, baseUri);
        registry.commitEpoch(root, baseUri, fromTs, toTs, batchFrom, batchTo);
        
        assertEq(registry.currentEpoch(), 1);
        
        // Verify epoch data
        (bytes32 storedRoot, uint64 storedFromTs, uint64 storedToTs, string memory storedBaseUri) = registry.epochs(1);
        assertEq(storedRoot, root);
        assertEq(storedFromTs, fromTs);
        assertEq(storedToTs, toTs);
        assertEq(storedBaseUri, baseUri);
        
        // Verify NFT base URI was updated
        assertEq(nft.baseUriEpoch(), baseUri);
    }
    
    function testCommitMultipleEpochs() public {
        // First epoch
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        
        assertEq(registry.currentEpoch(), 1);
        assertEq(nft.baseUriEpoch(), "ipfs://QmEpoch1/");
        
        // Move time forward
        vm.warp(block.timestamp + 2 days);
        
        // Second epoch
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(2)),
            "ipfs://QmEpoch2/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            2000
        );
        
        assertEq(registry.currentEpoch(), 2);
        assertEq(nft.baseUriEpoch(), "ipfs://QmEpoch2/");
        
        // Verify first epoch data is still accessible
        (bytes32 root1, , , string memory baseUri1) = registry.epochs(1);
        assertEq(root1, bytes32(uint256(1)));
        assertEq(baseUri1, "ipfs://QmEpoch1/");
        
        // Verify second epoch data
        (bytes32 root2, , , string memory baseUri2) = registry.epochs(2);
        assertEq(root2, bytes32(uint256(2)));
        assertEq(baseUri2, "ipfs://QmEpoch2/");
    }
    
    function test_RevertWhen_CommitEpochWithZeroRoot() public {
        vm.prank(gameBackend);
        vm.expectRevert("LoreEpochRegistry: root=0");
        registry.commitEpoch(
            bytes32(0),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
    }
    
    function test_RevertWhen_CommitEpochWithEmptyBaseUri() public {
        vm.prank(gameBackend);
        vm.expectRevert("LoreEpochRegistry: empty base");
        registry.commitEpoch(
            bytes32(uint256(1)),
            "",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
    }
    
    function test_RevertWhen_CommitEpochWithInvalidTimestampOrder() public {
        uint64 fromTs = uint64(block.timestamp + 1 days);
        uint64 toTs = uint64(block.timestamp); // Earlier than fromTs
        
        vm.prank(gameBackend);
        vm.expectRevert("LoreEpochRegistry: ts order");
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            fromTs,
            toTs,
            1,
            1000
        );
    }
    
    function test_RevertWhen_CommitOverlappingEpoch() public {
        // First epoch: day 0 to day 1
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        
        // Try to commit overlapping epoch: day 0.5 to day 2
        vm.prank(gameBackend);
        vm.expectRevert("LoreEpochRegistry: epoch overlap");
        registry.commitEpoch(
            bytes32(uint256(2)),
            "ipfs://QmEpoch2/",
            uint64(block.timestamp + 12 hours), // Overlaps with previous epoch
            uint64(block.timestamp + 2 days),
            1,
            2000
        );
    }
    
    function test_RevertWhen_CommitEpochAtSameTimestamp() public {
        // First epoch: day 0 to day 1
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        
        // Try to commit epoch at same end timestamp
        vm.prank(gameBackend);
        vm.expectRevert("LoreEpochRegistry: epoch overlap");
        registry.commitEpoch(
            bytes32(uint256(2)),
            "ipfs://QmEpoch2/",
            uint64(block.timestamp + 1 days), // Same as previous toTs
            uint64(block.timestamp + 2 days),
            1,
            2000
        );
    }
    
    function testCommitEpochSequentialTimestamps() public {
        // First epoch: day 0 to day 1
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        
        // Second epoch: day 1 + 1 second to day 2 (no overlap)
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(2)),
            "ipfs://QmEpoch2/",
            uint64(block.timestamp + 1 days + 1),
            uint64(block.timestamp + 2 days),
            1,
            2000
        );
        
        assertEq(registry.currentEpoch(), 2);
    }
    
    function test_RevertWhen_NonGameRoleCommitsEpoch() public {
        vm.prank(user);
        vm.expectRevert();
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
    }
    
    // ============ Epoch Query Tests ============
    
    function testEpochsQuery() public {
        bytes32 root = bytes32(uint256(123));
        string memory baseUri = "ipfs://QmTestEpoch/";
        uint64 fromTs = uint64(block.timestamp);
        uint64 toTs = uint64(block.timestamp + 7 days);
        
        vm.prank(gameBackend);
        registry.commitEpoch(root, baseUri, fromTs, toTs, 1, 1000);
        
        (bytes32 returnedRoot, uint64 returnedFromTs, uint64 returnedToTs, string memory returnedBaseUri) = registry.epochs(1);
        
        assertEq(returnedRoot, root);
        assertEq(returnedFromTs, fromTs);
        assertEq(returnedToTs, toTs);
        assertEq(returnedBaseUri, baseUri);
    }
    
    function testEpochsQueryNonexistent() public {
        (bytes32 root, uint64 fromTs, uint64 toTs, string memory baseUri) = registry.epochs(999);
        
        assertEq(root, bytes32(0));
        assertEq(fromTs, 0);
        assertEq(toTs, 0);
        assertEq(bytes(baseUri).length, 0);
    }
    
    function testCurrentEpochInitiallyZero() public {
        assertEq(registry.currentEpoch(), 0);
    }
    
    function testCurrentEpochIncrementsCorrectly() public {
        assertEq(registry.currentEpoch(), 0);
        
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
        assertEq(registry.currentEpoch(), 1);
        
        vm.warp(block.timestamp + 2 days);
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(2)),
            "ipfs://QmEpoch2/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            2000
        );
        assertEq(registry.currentEpoch(), 2);
        
        vm.warp(block.timestamp + 2 days);
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(3)),
            "ipfs://QmEpoch3/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            3000
        );
        assertEq(registry.currentEpoch(), 3);
    }
    
    // ============ Integration Tests ============
    
    function testIntegrationMintAndCommitEpoch() public {
        // Mint some NFTs
        vm.startPrank(admin);
        nft.mint(user, 1);
        nft.mint(user, 2);
        nft.mint(user, 3);
        vm.stopPrank();
        
        // Check initial token URIs
        assertEq(nft.tokenURI(1), string.concat(INITIAL_BASE_URI, "1.json"));
        assertEq(nft.tokenURI(2), string.concat(INITIAL_BASE_URI, "2.json"));
        assertEq(nft.tokenURI(3), string.concat(INITIAL_BASE_URI, "3.json"));
        
        // Commit first epoch
        string memory epoch1Uri = "ipfs://QmEpoch1/";
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            epoch1Uri,
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            100
        );
        
        // Check token URIs are updated
        assertEq(nft.tokenURI(1), string.concat(epoch1Uri, "1.json"));
        assertEq(nft.tokenURI(2), string.concat(epoch1Uri, "2.json"));
        assertEq(nft.tokenURI(3), string.concat(epoch1Uri, "3.json"));
        
        // Check historical URIs
        assertEq(nft.tokenURIAtEpoch(1, 1), string.concat(epoch1Uri, "1.json"));
        
        // Commit second epoch
        vm.warp(block.timestamp + 2 days);
        string memory epoch2Uri = "ipfs://QmEpoch2/";
        vm.prank(gameBackend);
        registry.commitEpoch(
            bytes32(uint256(2)),
            epoch2Uri,
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            100
        );
        
        // Check current token URIs use epoch 2
        assertEq(nft.tokenURI(1), string.concat(epoch2Uri, "1.json"));
        
        // Check historical URIs still work
        assertEq(nft.tokenURIAtEpoch(1, 1), string.concat(epoch1Uri, "1.json"));
        assertEq(nft.tokenURIAtEpoch(1, 2), string.concat(epoch2Uri, "1.json"));
    }
    
    function testIntegrationMultipleEpochsWithDifferentRoots() public {
        bytes32[] memory roots = new bytes32[](5);
        string[] memory baseUris = new string[](5);
        
        for (uint256 i = 0; i < 5; i++) {
            roots[i] = keccak256(abi.encodePacked("epoch", i));
            baseUris[i] = string.concat("ipfs://QmEpoch", vm.toString(i + 1), "/");
            
            vm.warp(block.timestamp + i * 2 days);
            
            vm.prank(gameBackend);
            registry.commitEpoch(
                roots[i],
                baseUris[i],
                uint64(block.timestamp),
                uint64(block.timestamp + 1 days),
                1,
                1000
            );
            
            assertEq(registry.currentEpoch(), uint64(i + 1));
            
            (bytes32 storedRoot, , , string memory storedBaseUri) = registry.epochs(uint64(i + 1));
            assertEq(storedRoot, roots[i]);
            assertEq(storedBaseUri, baseUris[i]);
        }
        
        // Verify all epochs are still accessible
        for (uint256 i = 0; i < 5; i++) {
            (bytes32 storedRoot, , , string memory storedBaseUri) = registry.epochs(uint64(i + 1));
            assertEq(storedRoot, roots[i]);
            assertEq(storedBaseUri, baseUris[i]);
        }
    }
    
    // ============ Role Management Tests ============
    
    function testGrantGameRole() public {
        address newGameBackend = address(0x999);
        
        vm.startPrank(admin);
        registry.grantRole(registry.GAME_ROLE(), newGameBackend);
        vm.stopPrank();
        
        assertTrue(registry.hasRole(registry.GAME_ROLE(), newGameBackend));
        
        // New game backend can commit epoch
        vm.prank(newGameBackend);
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
    }
    
    function testRevokeGameRole() public {
        vm.startPrank(admin);
        registry.revokeRole(registry.GAME_ROLE(), gameBackend);
        vm.stopPrank();
        
        assertFalse(registry.hasRole(registry.GAME_ROLE(), gameBackend));
        
        vm.prank(gameBackend);
        vm.expectRevert();
        registry.commitEpoch(
            bytes32(uint256(1)),
            "ipfs://QmEpoch1/",
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            1,
            1000
        );
    }
}

