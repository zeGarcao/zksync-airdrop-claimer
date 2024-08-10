const mongoose = require("mongoose");

const BLOCK_SCHEMA = new mongoose.Schema({
  _type: String,
  baseFeePerGas: String,
  difficulty: String,
  extraData: String,
  gasLimit: String,
  gasUsed: String,
  blobGasUsed: String,
  excessBlobGas: String,
  hash: String,
  miner: String,
  nonce: String,
  number: Number,
  parentHash: String,
  timestamp: Number,
  parentBeaconBlockRoot: String,
  stateRoot: String,
  receiptsRoot: String,
  transactions: [String]
});

module.exports = mongoose.model("Block", BLOCK_SCHEMA);
