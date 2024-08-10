const axios = require("axios");
const { getL1ToL2Alias, getSolidityPackedKeccak256 } = require("./web3");
const { default: MerkleTree } = require("merkletreejs");
const { ALLOCATIONS_PATHES } = require("./constants");
const { parse } = require("csv-parse");
const { createReadStream } = require("fs");
const { keccak256 } = require("ethers");
require("dotenv").config();

const getContractABI = async (address) => {
    let response = await axios.get(process.env.ZKS_API_URL, {
        params: {
            module: "contract",
            action: "getabi",
            address: address
        }
    });

    return response["data"]["result"];
}

const parseCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        let values = [];
        let parser = parse({ columns: false }, (error, records) => {
            if (error) {
                reject(error);
                return;
            }

            for (let i = 1; i < records.length; ++i) {
                values.push(records[i]);
            }

            resolve(values);
        });
        createReadStream(filePath).pipe(parser);
    })
}

const constructMerkleTree = async () => {
    let allAllocations = await parseCSV(ALLOCATIONS_PATHES[0]);
    let l1Allocations = await parseCSV(ALLOCATIONS_PATHES[1]);

    for (let i = 0; i < allAllocations.length; ++i) {
        for (let j = 0; j < l1Allocations.length; ++j) {
            if (allAllocations[i][0].toLowerCase() == l1Allocations[j][0].toLowerCase()) {
                allAllocations[i][0] = getL1ToL2Alias(allAllocations[i][0]);
                break;
            }
        }
    }

    let leaves = allAllocations.map((allocation, i) => ({
        address: allocation[0],
        amount: allocation[1],
        index: i,
        hashBuffer: Buffer.from(
            getSolidityPackedKeccak256(["uint256", "address", "uint256"], [i, allocation[0], allocation[1]])
                .replace("0x", ""),
            "hex"
        )
    }));

    let leavesBuffs = leaves.sort((a, b) => Buffer.compare(a.hashBuffer, b.hashBuffer));
    let tree = new MerkleTree(leavesBuffs.map((leaf) => leaf.hashBuffer), keccak256, { sortPairs: true });

    return [tree, leavesBuffs];
}

const getMerkleProof = (merkleTree, leaves, address) => {
    let leaf = null;
    let proof = null;

    for (let i = 0; i < leaves.length; ++i) {
        if (leaves[i].address.toLowerCase() == address.toLowerCase()) {
            leaf = leaves[i];
            break;
        }
    }

    proof = leaf != null ? merkleTree.getHexProof(leaf.hashBuffer) : null;

    return [leaf, proof];
}

module.exports = {
    getContractABI,
    constructMerkleTree,
    getMerkleProof
}