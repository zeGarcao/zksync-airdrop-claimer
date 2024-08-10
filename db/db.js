const mongoose = require("mongoose");
const Block = require("./schemas/block");
const Transaction = require("./schemas/transaction");
require("dotenv").config();

const DB = {
    connect: async () => await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`),

    disconnect: async () => await mongoose.disconnect(),

    saveBlock: async (block) => await new Block(block).save(),

    saveTransaction: async (transaction) => await new Transaction(transaction).save(),

    getBlock: async (blockNumber) => await Block.findOne({ number: blockNumber }),

    getTransaction: async (txHash) => await Transaction.findOne({ hash: txHash }),

    deleteBlock: async (blockNumber) => await Block.findOneAndDelete({ number: blockNumber }),

    deleteTransaction: async (txHash) => await Transaction.findOneAndDelete({ hash: txHash }),

    getOldestBlock: async () => (await Block.find({}).sort({ number: 1 }).limit(1)).at(0),

    deleteAllBlocks: async () => await Block.deleteMany(),

    deleteAllTransactions: async () => await Transaction.deleteMany(),

    updateTransaction: async (transaction) => await Transaction.updateOne({ _id: transaction._id }, transaction),

    getTransactionsWithoutABI: async () => await Transaction.find({ hasABI: false }),

    getERC20Contracts: async () => await Transaction.find({ isERC20: true }).select("contractAddress hash"),

    getZKTokenContracts: async () => await Transaction.find({ isZkSyncToken: true }).select("contractAddress hash"),

    getAirdropContracts: async () => await Transaction.find({ isAirdrop: true }).select("contractAddress hash"),

    getContractWithABI: async () => await Transaction.find({ hasABI: true }).select("contractAddress hash"),

    getTransactionCount: async () => await Transaction.countDocuments(),

    getBlockCount: async () => await Block.countDocuments(),

    deleteOldTransactions: async () => {
        let date = new Date();
        date.setDate(date.getDate() - 5);

        await Transaction.deleteMany({ hasABI: false, createdAt: { $lt: date } });
    }
}

module.exports = DB;
