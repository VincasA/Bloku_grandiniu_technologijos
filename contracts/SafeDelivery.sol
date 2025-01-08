// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowForGoods {
    address public manufacturer;
    address public retailer;
    address public courier;

    struct Order {
        string product;
        uint256 quantity;
        uint256 price;
        uint256 shippingFee;
        bool isPaid;
        bool isDelivered;
    }

    Order public currentOrder;

    event OrderSent(string product, uint256 quantity);
    event PriceSent(uint256 price, uint256 shippingFee);
    event InvoiceSent(uint256 price, uint256 shippingFee, uint256 deliveryDate);
    event OrderDelivered();

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Only the manufacturer can call this function.");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only the retailer can call this function.");
        _;
    }

    modifier onlyCourier() {
        require(msg.sender == courier, "Only the courier can call this function.");
        _;
    }

    constructor(address _retailer, address _courier) {
        manufacturer = msg.sender;
        retailer = _retailer;
        courier = _courier;
    }

    function sendOrder(string memory product, uint256 quantity) external onlyRetailer {
        currentOrder = Order({
            product: product,
            quantity: quantity,
            price: 0,
            shippingFee: 0,
            isPaid: false,
            isDelivered: false
        });
        emit OrderSent(product, quantity);
    }

    function setPrices(uint256 price, uint256 shippingFee) external onlyManufacturer {
        require(!currentOrder.isPaid, "Order already paid.");
        currentOrder.price = price;
        currentOrder.shippingFee = shippingFee;
        emit PriceSent(price, shippingFee);
    }

    function payOrder() external payable onlyRetailer {
        require(msg.value == currentOrder.price + currentOrder.shippingFee, "Incorrect payment amount.");
        currentOrder.isPaid = true;
    }

    function sendInvoice(uint256 deliveryDate) external onlyManufacturer {
        require(currentOrder.isPaid, "Order not paid yet.");
        emit InvoiceSent(currentOrder.price, currentOrder.shippingFee, deliveryDate);
    }

    function confirmDelivery() external onlyCourier {
        require(currentOrder.isPaid, "Order not paid yet.");
        currentOrder.isDelivered = true;
        emit OrderDelivered();
    }

    function finalizeOrder() external onlyRetailer {
        require(currentOrder.isDelivered, "Order not delivered yet.");

        payable(manufacturer).transfer(currentOrder.price);
        payable(courier).transfer(currentOrder.shippingFee);

        // Reset the current order
        delete currentOrder;
    }
}
