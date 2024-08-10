const readlineSync = require("readline-sync");
const { getWalletInstance, claimAirdrop } = require("./utils/web3");
const { COLORS } = require("./utils/constants");
const { constructMerkleTree, getMerkleProof } = require("./utils/utils");
require("dotenv").config();

const loadWallets = () => {
    console.log("Loading wallets...");
    let wallets = [];

    for (let key of process.env.PRIVATE_KEYS.split(",")) {
        let wallet = getWalletInstance(key);
        wallets.push(wallet);
    }

    return wallets;
}

const waitForUserResponse = (wallets) => {
    console.log("\nWallets to claim:");

    for (let wallet of wallets) {
        console.log(`${wallet.address}`);
    }

    return readlineSync.keyInYN("\nDo you want to proceed?");
}

const claim = async (wallets) => {
    console.log("Constructing merkle tree...");
    let [merkleTree, leaves] = await constructMerkleTree();

    for (let wallet of wallets) {
        console.log(`\nStarting claim for wallet ${wallet.address}...`);
        console.log("Get merkle proof...");
        let [leaf, merkleProof] = getMerkleProof(merkleTree, leaves, wallet.address);

        if (merkleProof) {
            console.log("Claiming airdrop...");
            let claimed = await claimAirdrop(wallet, leaf.index, leaf.amount, merkleProof);

            if (claimed) {
                console.log(COLORS.GREEN, "Airdrop successfully claimed!!");
            }
            else {
                console.log(COLORS.RED, "Claim failed!!");
            }
        }
        else {
            console.log(COLORS.RED, "Not elegible!!");
        }
    }
}

const startClaiming = async () => {
    let wallets = loadWallets();
    let userWantsToClaim = waitForUserResponse(wallets);

    if (userWantsToClaim) {
        console.log("Starting claim process...");
        await claim(wallets);
        console.log("Claim process finished!");
    }
    else {
        console.log("Exit!");
    }
}

const main = async () => {
    console.log("\nStart claiming...\n");
    await startClaiming();
}

main();
