require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    defaultNetwork:'goerli',
    networks:{
      hardhat: {},
      sepolia:{
        url: "https://sepolia.rpc.thirdweb.com",
        accounts: [`0x${process.env.PRIVATE_KEY_S}`]
      },
      holesky: {
        url: "https://holesky.rpc.thirdweb.com", 
        accounts: [`0x${process.env.PRIVATE_KEY_S}`], 
      }, 
      amoy: {
        url: "https://rpc-amoy.polygon.technology/",
        accounts: [`0x${process.env.PRIVATE_KEY}`], 
      },
      mainnet: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`, 
        accounts: [`0x${process.env.PRIVATE_KEY}`], 
      },     
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
