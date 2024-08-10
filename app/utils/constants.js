const BATCH_SIZE = 20;
const COLORS = {
    GREEN: "\x1b[32m%s\x1b[0m",
    YELLOW: "\x1b[33m%s\x1b[0m",
    MAGENTA: "\x1b[35m\x1b[5m%s\x1b[0m",
    RED: "\x1b[31m%s\x1b[0m"
};
const ABI_404 = "Contract source code not verified";
const ERC20_FUNCTION_NAMES = ["totalSupply", "balanceOf", "allowance", "transfer", "approve", "transferFrom"];
const AIRDROP_FUNCTION_NAMES = ["claim", "claimAndDelegate"];
const ZK_TOKEN_NAMES = ["ZKS", "SYNC", "ZKSYNC", "ZYNC", "ZK"];
const ALLOCATIONS_PATHES = ["airdrop-allocations-wave-1.csv", "l1_eligibility_list-wave-1.csv"];
const AIRDROP_ADDR = "0x66Fd4FC8FA52c9bec2AbA368047A0b27e24ecfe4";
const AIRDROP_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_admin",
                "type": "address"
            },
            {
                "internalType": "contract IMintableAndDelegatable",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_merkleRoot",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "_maximumTotalClaimable",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_windowStart",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_windowEnd",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "currentNonce",
                "type": "uint256"
            }
        ],
        "name": "InvalidAccountNonce",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidShortString",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringTooLong",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__AlreadyClaimed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__ClaimAmountExceedsMaximum",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__ClaimWindowNotOpen",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__ClaimWindowNotYetClosed",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__ExpiredSignature",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__InvalidProof",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__InvalidSignature",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZkMerkleDistributor__SweepAlreadyDone",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "ZkMerkleDistributor__Unauthorized",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Claimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "EIP712DomainChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ADMIN",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DOMAIN_SEPARATOR",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAXIMUM_TOTAL_CLAIMABLE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MERKLE_ROOT",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TOKEN",
        "outputs": [
            {
                "internalType": "contract IMintableAndDelegatable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WINDOW_END",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "WINDOW_START",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ZK_CLAIM_AND_DELEGATE_TYPEHASH",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ZK_CLAIM_TYPEHASH",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "_merkleProof",
                "type": "bytes32[]"
            }
        ],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "_merkleProof",
                "type": "bytes32[]"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "delegatee",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ZkMerkleDistributor.DelegateInfo",
                "name": "_delegateInfo",
                "type": "tuple"
            }
        ],
        "name": "claimAndDelegate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "_merkleProof",
                "type": "bytes32[]"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "claimant",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ZkMerkleDistributor.ClaimSignatureInfo",
                "name": "_claimSignatureInfo",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "delegatee",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ZkMerkleDistributor.DelegateInfo",
                "name": "_delegateInfo",
                "type": "tuple"
            }
        ],
        "name": "claimAndDelegateOnBehalf",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes32[]",
                "name": "_merkleProof",
                "type": "bytes32[]"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "claimant",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct ZkMerkleDistributor.ClaimSignatureInfo",
                "name": "_claimSignatureInfo",
                "type": "tuple"
            }
        ],
        "name": "claimOnBehalf",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eip712Domain",
        "outputs": [
            {
                "internalType": "bytes1",
                "name": "fields",
                "type": "bytes1"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "verifyingContract",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "extensions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "invalidateNonce",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "isClaimed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "nonces",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_unclaimedReceiver",
                "type": "address"
            }
        ],
        "name": "sweepUnclaimed",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalClaimed",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const WORKER_TIMER = 500;
const WORKER_BATCH_TIMER = 100;
const CLEANER_TIMER = 86400000;
const ABIZER_TIMER = 28800000;

module.exports = {
    BATCH_SIZE,
    COLORS,
    ABI_404,
    ERC20_FUNCTION_NAMES,
    AIRDROP_FUNCTION_NAMES,
    ZK_TOKEN_NAMES,
    ALLOCATIONS_PATHES,
    AIRDROP_ADDR,
    AIRDROP_ABI,
    WORKER_TIMER,
    WORKER_BATCH_TIMER,
    CLEANER_TIMER,
    ABIZER_TIMER
};