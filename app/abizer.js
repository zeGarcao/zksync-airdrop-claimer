const DB = require("../db/db");
const { setTimeout } = require("timers/promises");
const { getContractABI } = require("./utils/utils");
const { getContractInstance, hasFunction, getTokenSymbol } = require("./utils/web3");
const { COLORS, ABI_404, ERC20_FUNCTION_NAMES, ZK_TOKEN_NAMES, AIRDROP_FUNCTION_NAMES, ABIZER_TIMER } = require("./utils/constants");

const checkForERC20 = (contract) => {
    for (let functionName of ERC20_FUNCTION_NAMES) {
        if (!hasFunction(contract, functionName)) {
            return false;
        }
    }

    return true;
}

const checkForZkSyncToken = async (contract) => {
    let symbol = await getTokenSymbol(contract);
    return ZK_TOKEN_NAMES.includes(symbol);
}

const checkForAirdrop = (contract) => {
    let hasClaimAndDelegate = hasFunction(contract, AIRDROP_FUNCTION_NAMES[0]);
    let hasClaim = hasFunction(contract, AIRDROP_FUNCTION_NAMES[1]);

    return hasClaim || hasClaimAndDelegate;
}

const inspectABI = async (contract) => {
    let isAirdrop = checkForAirdrop(contract);
    let isERC20 = checkForERC20(contract);
    let isZkSyncToken = isERC20 && await checkForZkSyncToken(contract);

    return [isAirdrop, isERC20, isZkSyncToken];
}

const abiLookup = async (transaction) => {
    console.log(`ABI lookup for contract at ${transaction.contractAddress}...`);

    let abi = await getContractABI(transaction.contractAddress);

    if (abi == ABI_404) {
        console.log(COLORS.RED, `ABI not found for contract at ${transaction.contractAddress}`);
    }
    else {
        console.log(COLORS.GREEN, `ABI found for contract at ${transaction.contractAddress}`);

        let contract = getContractInstance(transaction.contractAddress, abi);
        let [isAirdrop, isERC20, isZkSyncToken] = await inspectABI(contract);

        transaction.isERC20 = isERC20;
        transaction.isZkSyncToken = isZkSyncToken;
        transaction.isAirdrop = isAirdrop;
        transaction.hasABI = true;

        let msg = isAirdrop ? "airdrop" : isZkSyncToken ? "ZK token" : isERC20 ? "ERC20" : null;

        if (msg) {
            console.log(COLORS.MAGENTA, "\n==========================================================");
            console.log(COLORS.MAGENTA, `   Contract ${transaction.contractAddress} is ${msg}!!`);
            console.log(COLORS.MAGENTA, "==========================================================\n");
        }

        console.log(COLORS.YELLOW, "Updating transaction...");
        await DB.updateTransaction(transaction);
        console.log(COLORS.GREEN, "Transaction updated!");
    }
}

const handleAbis = async () => {
    console.log("\nStarting to handle transactions...");
    let transactions = await DB.getTransactionsWithoutABI();

    for (const tx of transactions) {
        await abiLookup(tx);
    }
}

const startAbizing = async () => {
    await handleAbis();
    await setTimeout(ABIZER_TIMER);
    startAbizing();
}

const main = async () => {
    console.log("\nConnecting to DB...");

    DB.connect().then(() => {
        console.log(COLORS.GREEN, "\nSuccessfully connected to DB!");
        console.log("\nStart abizing...\n");
        startAbizing();
    }).catch(err => {
        console.log(COLORS.RED, `\n${err}\n`);
        console.log(COLORS.RED, "\nDB connection failed!");
    });
}

main();
