# zkSync Airdrop Claimer

This is a zkSync airdrop scanner and claimer. This project is divided into five entities:

- `spy.js`: Listens to each new block and stores it in the database.
- `worker.js`: Scans the blocks stored by `spy.js` and records each transaction where a smart contract was deployed (**runs every 500 ms**).
- `abizer.js`: Fetches the ABI of each smart contract deployed in a transaction recorded by `worker.js` (**runs every 28,800,000 ms**). Tries to find out if the zkSync token and airdrop smart contracts have been deployed.
- `cleaner.js`: Deletes from the database all the smart contracts for which no ABI was found within a 5-day period (**runs every 86,400,000 ms**).
- `claimer.js`: Claims the zkSync airdrop.

## Requirements

Make sure you have the following installed before proceeding:

- [MongoDB](https://www.mongodb.com/try/download/community)
- [NodeJS](https://nodejs.org/en/download/)

## Setup

First, run the following command in the terminal to install all the project dependencies.

```zsh
npm install
```

Next, clone the `.env.example` file and rename the cloned file as `.env`. Finally, configure the following required environment variables:

- `PROVIDER_URL`: zkSync RPC URL
- `PRIVATE_KEYS`: Private keys separated by commas
- `ZKS_API_URL`: zkSync API URL
- `DB_NAME`: Name of database

## Scanner Instructions

To start running the scanner, execute the following command in the terminal.

```zsh
pm2 start app/spy.js app/worker.js app/abizer.js app/cleaner.js --watch app/
```

To monitor all processes, run the following command.

```zsh
pm2 monit
```

To list all processes, run the following command.

```zsh
pm2 list
```

To stop all processes, run the following command.

```zsh
pm2 stop spy worker abizer cleaner
```

> **Note:** You can find more information about the `pm2` npm package [here](https://pm2.keymetrics.io/docs/usage/quick-start/).

## Claimer Instructions

To start running the claimer, you only need to run the following command in your terminal and follow the instructions.

```zsh
node app/claimer.js
```
