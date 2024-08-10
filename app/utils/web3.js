require("dotenv").config();
const { getDefaultProvider, Contract, Wallet, formatEther, solidityPackedKeccak256, parseEther, parseUnits } = require("ethers");
const { applyL1ToL2Alias } = require("zksync-ethers/build/utils");
const { AIRDROP_ADDR, AIRDROP_ABI } = require("./constants");

const PROVIDER = getDefaultProvider(process.env.PROVIDER_URL);
const AIRDROP = new Contract(AIRDROP_ADDR, AIRDROP_ABI, PROVIDER);

const getTransactionReceipt = async (txHash) => {
    let receipt = await PROVIDER.getTransactionReceipt(txHash);
    return receipt;
}

const startBlockListener = (callback) => {
    return PROVIDER.on("block", callback);
}

const getBlockData = async (blockNumber) => {
    let blockData = await PROVIDER.getBlock(blockNumber);
    return blockData;
}

const getContractInstance = (address, abi) => {
    return new Contract(address, abi, PROVIDER);
}

const hasFunction = (contract, functionName) => {
    return contract.interface.hasFunction(functionName);
}

const getTokenSymbol = async (contract) => {
    let symbol = await contract.symbol();
    return symbol;
}

const getWalletInstance = (key) => {
    return new Wallet(key, PROVIDER);
}

const getL1ToL2Alias = (address) => {
    return applyL1ToL2Alias(address);
}

const getSolidityPackedKeccak256 = (types, data) => {
    return solidityPackedKeccak256(types, data);
}

const claimAirdrop = async (wallet, index, amount, merkleProof) => {
    let claimed = false;
    try {
        let tx = await AIRDROP.connect(wallet).claim(index, amount, merkleProof);
        await tx.wait();
        claimed = true;
    } catch (err) {
        console.log(err);
    }
    return claimed;
}

module.exports = {
    getTransactionReceipt,
    startBlockListener,
    getBlockData,
    getContractInstance,
    hasFunction,
    getTokenSymbol,
    getWalletInstance,
    getL1ToL2Alias,
    getSolidityPackedKeccak256,
    claimAirdrop
}