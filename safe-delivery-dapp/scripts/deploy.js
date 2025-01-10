const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contract with the account:", deployer.address);

    const retailer = "0xe5E330D37b09daC2549367996e38A6D388d8e6E1"; // Replace with a valid Ganache address
    const courier = "0xDC9B2ab63F8Ad9C4F1089316c18DeF9BBFf8497a";  // Replace with a valid Ganache address

    const SafeDelivery = await hre.ethers.getContractFactory("SafeDelivery");
    const safeDelivery = await SafeDelivery.deploy(retailer, courier);

    await safeDelivery.deployed();

    console.log("SafeDelivery deployed to:", safeDelivery.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
