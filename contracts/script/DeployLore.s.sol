// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "forge-std/Script.sol";
import "../src/LoreNFT.sol";
import "../src/LoreEpochRegistry.sol";

/**
 * @title Deploy script for LoreNFT and LoreEpochRegistry
 * @notice This script deploys both contracts and sets up the necessary roles
 * 
 * Required environment variables:
 * - OWNER_PRIVATE_KEY: Private key for deployment
 * - BACKEND_SIGNER: Address of the backend signer for transfer authorization
 * 
 * Optional environment variables:
 * - NFT_NAME: Name of the NFT collection (default: "Lore Game Assets")
 * - NFT_SYMBOL: Symbol of the NFT collection (default: "LORE")
 * - INITIAL_BASE_URI: Initial IPFS base URI (default: "ipfs://")
 */
contract DeployLore is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("OWNER_PRIVATE_KEY");
        address backendSigner = vm.envAddress("BACKEND_SIGNER");
        
        // Get optional parameters with defaults
        string memory nftName = vm.envOr("NFT_NAME", string("Lore Game Assets"));
        string memory nftSymbol = vm.envOr("NFT_SYMBOL", string("LORE"));
        string memory initialBaseUri = vm.envOr("INITIAL_BASE_URI", string("ipfs://"));
        
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== Deployment Configuration ===");
        console.log("Deployer:", deployer);
        console.log("Backend Signer:", backendSigner);
        console.log("NFT Name:", nftName);
        console.log("NFT Symbol:", nftSymbol);
        console.log("Initial Base URI:", initialBaseUri);
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Step 1: Deploy a temporary mock registry (we'll use the deployer address as placeholder)
        // The NFT constructor requires a non-zero address for the registry
        address tempRegistry = deployer; // Temporary placeholder
        
        console.log("Step 1: Deploying LoreNFT with temporary registry...");
        LoreNFT nft = new LoreNFT(
            nftName,
            nftSymbol,
            deployer,           // admin
            initialBaseUri,     // initialBaseUriEpoch
            ILoreEpochs(tempRegistry), // temporary registry (will be updated)
            backendSigner       // backendSigner
        );
        console.log("LoreNFT deployed at:", address(nft));
        console.log("");
        
        // Step 2: Deploy the real LoreEpochRegistry
        console.log("Step 2: Deploying LoreEpochRegistry...");
        LoreEpochRegistry registry = new LoreEpochRegistry(
            deployer,  // admin
            nft        // nft
        );
        console.log("LoreEpochRegistry deployed at:", address(registry));
        console.log("");
        
        // Step 3: Update the NFT to point to the real registry
        console.log("Step 3: Updating LoreNFT registry reference...");
        nft.setLoreRegistry(ILoreEpochs(address(registry)));
        console.log("Registry updated in NFT");
        console.log("");
        
        // Step 4: Grant REGISTRY_ROLE to the registry contract
        console.log("Step 4: Granting REGISTRY_ROLE to registry contract...");
        bytes32 REGISTRY_ROLE = nft.REGISTRY_ROLE();
        nft.grantRole(REGISTRY_ROLE, address(registry));
        console.log("REGISTRY_ROLE granted to registry");
        console.log("");
        
        vm.stopBroadcast();
        
        console.log("=== Deployment Complete ===");
        console.log("LoreNFT:", address(nft));
        console.log("LoreEpochRegistry:", address(registry));
        console.log("Admin:", deployer);
        console.log("Backend Signer:", backendSigner);
        console.log("");
        console.log("=== Roles Summary ===");
        console.log("NFT DEFAULT_ADMIN_ROLE:", deployer);
        console.log("NFT MINTER_ROLE:", deployer);
        console.log("NFT REGISTRY_ROLE:", address(registry), "(registry contract)");
        console.log("Registry DEFAULT_ADMIN_ROLE:", deployer);
        console.log("Registry GAME_ROLE:", deployer);
        console.log("Registry NFT_MANAGER:", deployer);
    }
}

