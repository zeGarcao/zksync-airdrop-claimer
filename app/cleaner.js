const DB = require("../db/db");
const { setTimeout } = require("timers/promises");
const { COLORS, CLEANER_TIMER } = require("./utils/constants");

const clean = async () => {
    console.log("Deleting old transactions...");
    await DB.deleteOldTransactions();
    console.log(COLORS.GREEN, "Transactions deleted!!");
}

const startCleaning = async () => {
    await clean();
    await setTimeout(CLEANER_TIMER);
    startCleaning();
}

const main = async () => {
    console.log("\nConnecting to DB...");

    DB.connect().then(() => {
        console.log(COLORS.GREEN, "\nSuccessfully connected to DB!");
        console.log("\nStart cleaning...\n");
        startCleaning();
    }).catch(err => {
        console.log(COLORS.RED, `\n${err}\n`);
        console.log(COLORS.RED, "\nDB connection failed!");
    });
}

main();