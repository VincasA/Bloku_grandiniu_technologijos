// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdvancedDelivery {
    // Dalyviai
    address public manufacturer;
    address public retailer;
    address public courier;

    // Sutarties būsena
    enum State { Created, Ordered, Priced, Paid, Invoiced, Delivered, Completed }
    State public state;

    // Kainos
    uint public orderPrice;
    uint public shipmentPrice;

    // Įvykiai
    event OrderSent(uint quantity, string product);
    event PriceSent(uint orderPrice, uint shipmentPrice);
    event InvoiceSent(string invoiceData, uint deliveryDate);
    event OrderDelivered();

    // Tik leidžiamiems adresams vykdyti funkcijas
    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Tik gamintojas gali vykdyti šią funkciją.");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Tik mažmenininkas gali vykdyti šią funkciją.");
        _;
    }

    modifier onlyCourier() {
        require(msg.sender == courier, "Tik kurjeris gali vykdyti šią funkciją.");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Ši funkcija negali būti vykdoma dabartinėje būsenoje.");
        _;
    }

    // Sutarties kūrimas
    constructor(address _retailer, address _courier) {
        manufacturer = msg.sender;
        retailer = _retailer;
        courier = _courier;
        state = State.Created;
    }

    // Užsakymo pateikimas
    function sendOrder(string memory product, uint quantity) external onlyRetailer inState(State.Created) {
        state = State.Ordered;
        emit OrderSent(quantity, product);
    }

    // Užsakymo ir siuntos kainos nustatymas
    function setPrices(uint _orderPrice, uint _shipmentPrice) external onlyManufacturer inState(State.Ordered) {
        orderPrice = _orderPrice;
        shipmentPrice = _shipmentPrice;
        state = State.Priced;
        emit PriceSent(orderPrice, shipmentPrice);
    }

    // Apmokėjimas
    function makePayment() external payable onlyRetailer inState(State.Priced) {
        require(msg.value == orderPrice + shipmentPrice, "Netinkama mokėjimo suma.");
        state = State.Paid;
    }

    // Sąskaitos išrašymas
    function sendInvoice(string memory invoiceData, uint deliveryDate) external onlyManufacturer inState(State.Paid) {
        state = State.Invoiced;
        emit InvoiceSent(invoiceData, deliveryDate);
    }

    // Užsakymo pristatymo patvirtinimas
    function confirmDelivery() external onlyCourier inState(State.Invoiced) {
        state = State.Delivered;
        emit OrderDelivered();
    }

    // Lėšų paskirstymas
    function finalizeOrder() external onlyRetailer inState(State.Delivered) {
        state = State.Completed;
        payable(manufacturer).transfer(orderPrice);
        payable(courier).transfer(shipmentPrice);
    }
}