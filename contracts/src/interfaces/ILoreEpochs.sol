// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Epochs interface (on-chain epoch roots for verifiable IPFS snapshots)
 */
interface ILoreEpochs {
    /**
     * @dev One epoch commit: merkle/hash root + timeframe.
     */
    struct Epoch {
        bytes32 root;
        uint64  fromTs;
        uint64  toTs;
        string  baseUri; // ipfs://<CID_epoch>/ (per-epoch directory for dynamic JSON)
    }

    /**
     * @return The latest committed epoch id (monotonic, starts from 1).
     */
    function currentEpoch() external view returns (uint64);

    /**
     * @param epochId The epoch ID
     * @return root The Merkle root of the epoch
     * @return fromTs The start timestamp of the epoch
     * @return toTs The end timestamp of the epoch
     * @return baseUri The IPFS directory for the epoch
     */
    function epochs(uint64 epochId)
        external
        view
        returns (bytes32 root, uint64 fromTs, uint64 toTs, string memory baseUri);
}
