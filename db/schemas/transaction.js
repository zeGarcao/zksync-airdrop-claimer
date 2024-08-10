const mongoose = require("mongoose");

const TRANSACTION_SCHEMA = new mongoose.Schema({
  _type: String,
  blockHash: String,
  blockNumber: Number,
  contractAddress: String,
  cumulativeGasUsed: String,
  from: String,
  gasPrice: String,
  blobGasUsed: String,
  blobGasPrice: String,
  gasUsed: String,
  hash: String,
  index: Number,
  logsBloom: String,
  root: String,
  status: Number,
  to: String,
  isERC20: Boolean,
  isAirdrop: Boolean,
  hasABI: {
    type: Boolean,
    default: false
  },
  isZkSyncToken: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TRANSACTION_SCHEMA);
