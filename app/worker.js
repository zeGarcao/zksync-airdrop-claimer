const { COLORS, BATCH_SIZE, WORKER_BATCH_TIMER, WORKER_TIMER } = require("./utils/constants");
const { getTransactionReceipt } = require("./utils/web3");
const { setTimeout } = require("timers/promises");
const DB = require("../db/db");


const processTransactionBatch = async (batch) => {
    console.log(`Fetching transactions...`);
    let txPromises = batch.map(txHash => getTransactionReceipt(txHash));
    let transactions = await Promise.all(txPromises);

    let transaction;
    let txJSONs = [];

    for (let i = 0; i < transactions.length; ++i) {
        transaction = transactions[i];

        console.log(`Processing transaction ${transaction.hash}...`);

        if (transaction.contractAddress) {
            console.log(COLORS.MAGENTA, "\n==========================================================");
            console.log(COLORS.MAGENTA, "   Found a transaction that deployed a smart contract!!");
            console.log(COLORS.MAGENTA, "==========================================================\n");

            txJSONs.push(transaction.toJSON());
        }
    }

    console.log(COLORS.YELLOW, `Saving transactions...`);
    let dbPromises = txJSONs.map(txJSON => DB.saveTransaction(txJSON));
    await Promise.all(dbPromises);
    console.log(COLORS.GREEN, `Transactions saved!`);
}

const processTransactions = async (transactions) => {
    let batch;

    while (transactions.length > 0) {
        batch = transactions.splice(0, Math.min(transactions.length, BATCH_SIZE));
        await processTransactionBatch(batch);
        await setTimeout(WORKER_BATCH_TIMER);
    }
}

const handleBlock = async () => {
    return new Promise(async (resolve) => {
        let block = await DB.getOldestBlock();

        if (block) {
            console.log(`\nStart processing transactions from block ${block.number}`);
            await processTransactions(block.transactions);

            console.log(COLORS.YELLOW, `Deleting block ${block.number}...`);
            await DB.deleteBlock(block.number);

            console.log(COLORS.RED, `Block ${block.number} deleted!`);
        }
        else {
            console.log(COLORS.RED, "\nNo blocks for now...\n");
        }

        resolve();
    });
}

const startWorking = async () => {
    await handleBlock();
    await setTimeout(WORKER_TIMER);
    startWorking();
}

const main = async () => {
    console.log("\nConnecting to DB...");

    DB.connect().then(() => {
        console.log(COLORS.GREEN, "\nSuccessfully connected to DB!");
        console.log("\nStart working...\n");
        startWorking();
    }).catch(err => {
        console.log(COLORS.RED, `\n${err}\n`);
        console.log(COLORS.RED, "\nDB connection failed!");
    });
}

main();
