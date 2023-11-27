require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_GOERLI_RPC_URL,
      accounts: [process.env.TEST_PKEY_0, process.env.TEST_PKEY_1]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};
