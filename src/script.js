// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
    var web3 = new Web3(window.ethereum);
    console.log('Web3 Detected!');
} else {
    alert('Please install MetaMask or another Ethereum-compatible browser extension.');
}

// Smart Contract ABI and Address
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_retailer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_courier",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "shippingFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "deliveryDate",
          "type": "uint256"
        }
      ],
      "name": "InvoiceSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "OrderDelivered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "product",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "OrderSent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "shippingFee",
          "type": "uint256"
        }
      ],
      "name": "PriceSent",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "confirmDelivery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "courier",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentOrder",
      "outputs": [
        {
          "internalType": "string",
          "name": "product",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "shippingFee",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isPaid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isDelivered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "finalizeOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manufacturer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retailer",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "deliveryDate",
          "type": "uint256"
        }
      ],
      "name": "sendInvoice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "product",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "sendOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "shippingFee",
          "type": "uint256"
        }
      ],
      "name": "setPrices",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
let contract;

// Fetch Contract Address from Config File
fetch("./config.json")
    .then((response) => response.json())
    .then((config) => {
        contract = new web3.eth.Contract(contractABI, config.contractAddress);
        console.log("Contract initialized with address:", config.contractAddress);
    })
    .catch((error) => console.error("Error fetching contract address:", error));

// Utility: Update Event List
function updateEventList(eventMessage) {
    const eventsList = document.getElementById('eventsList');
    const newEvent = document.createElement('li');
    newEvent.textContent = eventMessage;
    eventsList.prepend(newEvent);
}

// Wallet Connection
let selectedAccount;
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = accounts[0];
            web3.eth.defaultAccount = selectedAccount; // Explicitly set the default account
            document.getElementById('walletAddress').textContent = `Connected: ${selectedAccount}`;
            document.querySelectorAll('button').forEach(button => button.disabled = false);
        } catch (error) {
            console.error('User rejected the request:', error);
        }
    } else {
        alert('Please install MetaMask to use this application.');
    }
}

// Functions for Manufacturer
async function createContract() {
    const retailer = document.getElementById('retailerAddress').value;
    const courier = document.getElementById('courierAddress').value;

    // Log the contract initialization details (Optional)
    const manufacturer = await contract.methods.manufacturer().call();
    console.log("Manufacturer Address:", manufacturer);

    alert("Contract was initialized during deployment. No need to call 'Create Contract' again.");
}


async function setPrices() {
    const price = document.getElementById('price').value;
    const shippingFee = document.getElementById('shippingFee').value;

    await contract.methods.setPrices(price, shippingFee).send({ from: selectedAccount });
    updateEventList(`Prices set: ${price} Wei (Order) + ${shippingFee} Wei (Shipping)`);
}

async function sendInvoice() {
    const deliveryDate = document.getElementById('deliveryDate').value;

    await contract.methods.sendInvoice(deliveryDate).send({ from: selectedAccount });
    updateEventList(`Invoice sent with Delivery Date: ${deliveryDate}`);
}

// Functions for Retailer
async function sendOrder() {
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;

    await contract.methods.sendOrder(product, quantity).send({ from: selectedAccount });
    updateEventList(`Order sent: ${product} (Quantity: ${quantity})`);
}

async function payOrder() {
    const paymentValue = document.getElementById('paymentValue').value;

    await contract.methods.payOrder().send({ from: selectedAccount, value: paymentValue });
    updateEventList(`Order paid: ${paymentValue} Wei`);
}

async function finalizeOrder() {
    await contract.methods.finalizeOrder().send({ from: selectedAccount });
    updateEventList('Order finalized and funds distributed.');
}

// Functions for Courier
async function confirmDelivery() {
    await contract.methods.confirmDelivery().send({ from: selectedAccount });
    updateEventList('Delivery confirmed by Courier.');
}

// Listen for Contract Events
contract?.events.OrderSent({}, (error, event) => {
    if (!error) updateEventList(`Event: OrderSent - ${JSON.stringify(event.returnValues)}`);
});

contract?.events.PriceSent({}, (error, event) => {
    if (!error) updateEventList(`Event: PriceSent - ${JSON.stringify(event.returnValues)}`);
});

contract?.events.InvoiceSent({}, (error, event) => {
    if (!error) updateEventList(`Event: InvoiceSent - ${JSON.stringify(event.returnValues)}`);
});

contract?.events.OrderDelivered({}, (error, event) => {
    if (!error) updateEventList('Event: OrderDelivered');
});
