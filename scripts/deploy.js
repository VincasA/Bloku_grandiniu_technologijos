const hre = require("hardhat");

async function main() {
    // Gaukime sąskaitas, kurios naudojamos testavimui
    const [manufacturer, retailer, courier] = await hre.ethers.getSigners();

    // Kompiliuojame ir iškeliame kontraktą
    const AdvancedDelivery = await hre.ethers.getContractFactory("AdvancedDelivery");
    const contract = await AdvancedDelivery.deploy(retailer.address, courier.address);

    await contract.deployed();
    console.log("AdvancedDelivery contract deployed to:", contract.address);

    // Pateikiame užsakymą
    const product = "Product X";
    const quantity = 100;
    const orderTx = await contract.connect(retailer).sendOrder(product, quantity);
    await orderTx.wait();
    console.log(`Order sent: ${product}, quantity: ${quantity}`);

    // Gamintojas nustato kainas
    const orderPrice = hre.ethers.utils.parseEther("10"); // 10 ETH už užsakymą
    const shipmentPrice = hre.ethers.utils.parseEther("2"); // 2 ETH už siuntą
    const priceTx = await contract.connect(manufacturer).setPrices(orderPrice, shipmentPrice);
    await priceTx.wait();
    console.log(`Prices set: Order Price - ${orderPrice}, Shipment Price - ${shipmentPrice}`);

    // Mažmenininkas atlieka apmokėjimą
    const paymentTx = await contract.connect(retailer).makePayment({ value: orderPrice.add(shipmentPrice) });
    await paymentTx.wait();
    console.log("Payment made by retailer.");

    // Gamintojas siunčia sąskaitą
    const invoiceData = "Invoice #123";
    const deliveryDate = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // Po 7 dienų
    const invoiceTx = await contract.connect(manufacturer).sendInvoice(invoiceData, deliveryDate);
    await invoiceTx.wait();
    console.log(`Invoice sent: ${invoiceData}, Delivery Date: ${new Date(deliveryDate * 1000)}`);

    // Kurjeris patvirtina pristatymą
    const deliveryTx = await contract.connect(courier).confirmDelivery();
    await deliveryTx.wait();
    console.log("Order marked as delivered by courier.");

    // Lėšų paskirstymas
    const finalizeTx = await contract.connect(retailer).finalizeOrder();
    await finalizeTx.wait();
    console.log("Order finalized. Funds distributed.");
}

// Paleidžiame funkciją ir apdorojame klaidas
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
