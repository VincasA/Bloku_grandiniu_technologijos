require("@nomiclabs/hardhat-ethers");

module.exports = {
    solidity: "0.8.0", // Match your Solidity version
    networks: {
        ganache: {
            url: "http://127.0.0.1:7545", // Ganache RPC URL
            accounts: ["0x3216609da1973c09aec27063db197d3b529dccddfa94faa77b727d4b8e130ce3"], // Replace with a private key from Ganache
        },
    },
};
