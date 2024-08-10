const { getBlockData, startBlockListener } = require("./utils/web3");
const { COLORS } = require("./utils/constants");
const DB = require("../db/db");

const saveBlock = async (blockNumber) => {
    console.log(`Getting block ${blockNumber}...`);
    let block = await getBlockData(blockNumber);
    console.log(COLORS.YELLOW, `Saving block ${blockNumber}...`);
    await DB.saveBlock(block.toJSON());

    console.log(COLORS.GREEN, `Block ${blockNumber} saved!`);
}

const startSpying = () => {
    console.log("\nStart spying...\n");
    startBlockListener(saveBlock)
        .catch(async (err) => {
            console.log(COLORS.RED, `\n${err}\n`);
            console.log("\nDisconnecting from DB...");
            await DB.disconnect();
            console.log("\nDB connection closed!");
        });
}

const main = async () => {
    console.log("\nConnecting to DB...");

    DB.connect().then(() => {
        console.log(COLORS.GREEN, "\nSuccessfully connected to DB!");
        startSpying();
    }).catch(err => {
        console.log(COLORS.RED, `\n${err}\n`);
        console.log(COLORS.RED, "\nDB connection failed!");
    });
}

main();
