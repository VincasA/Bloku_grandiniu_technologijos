const contractABI = [
    [
        {
            "inputs": [],
            "name": "confirmDelivery",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "inputs": [],
            "name": "payOrder",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
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
        }
    ]
  ];
  
  let web3;
  let contract;
  let contractAddress = ""; // Replace with your deployed contract address
  
  // Helper function for updating status messages
  function updateStatus(message, isError = false) {
    const statusElement = document.getElementById("status"); // Reference the "status" element
    statusElement.style.color = isError ? "red" : "green"; // Set the text color based on success/error
    statusElement.innerText = message; // Update the message text
  }
  
  
  // Connect Wallet
  document.getElementById("connectWallet").addEventListener("click", async () => {
    if (window.ethereum) {
      try {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: "eth_requestAccounts" });
        updateStatus("Wallet connected.");
      } catch (error) {
        updateStatus(`Error connecting wallet: ${error.message}`, true);
      }
    } else {
      alert("Please install Metamask to use this feature.");
    }
  });
  
  // Deploy Contract
  document.getElementById("deployForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const retailer = document.getElementById("retailerAddress").value;
    const courier = document.getElementById("courierAddress").value;
  
    const accounts = await web3.eth.getAccounts();
    const manufacturer = accounts[0];
    const Contract = new web3.eth.Contract(contractABI);
  
    try {
      Contract.deploy({
        data: "608060405234801561000f575f80fd5b506040516117d33803806117d383398181016040528101906100319190610155565b335f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050610193565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610124826100fb565b9050919050565b6101348161011a565b811461013e575f80fd5b50565b5f8151905061014f8161012b565b92915050565b5f806040838503121561016b5761016a6100f7565b5b5f61017885828601610141565b925050602061018985828601610141565b9150509250929050565b611633806101a05f395ff3fe608060405260043610610090575f3560e01c8063747542821161005857806374754282146101305780639670d6991461015a5780639e28229d14610182578063c6a262a0146101b1578063e041bc4a146101c757610090565b806305fefda714610094578063101b4dd5146100bc5780634c1249fc146100c657806350a7f7d3146100f05780635e10177b1461011a575b5f80fd5b34801561009f575f80fd5b506100ba60048036038101906100b59190610bba565b6101ef565b005b6100c461031e565b005b3480156100d1575f80fd5b506100da610422565b6040516100e79190610c37565b60405180910390f35b3480156100fb575f80fd5b50610104610447565b6040516101119190610c37565b60405180910390f35b348015610125575f80fd5b5061012e61046c565b005b34801561013b575f80fd5b50610144610598565b6040516101519190610c37565b60405180910390f35b348015610165575f80fd5b50610180600480360381019061017b9190610d8c565b6105bb565b005b34801561018d575f80fd5b5061019661072e565b6040516101a896959493929190610e6f565b60405180910390f35b3480156101bc575f80fd5b506101c56107f6565b005b3480156101d2575f80fd5b506101ed60048036038101906101e89190610ed5565b6109f9565b005b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461027c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161027390610f70565b60405180910390fd5b60036004015f9054906101000a900460ff16156102ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102c590610fd8565b60405180910390fd5b816003600201819055508060038001819055507f26202ff78573f5726c012cc4de96c689ec958a0685258809e8571840fe7166698282604051610312929190610ff6565b60405180910390a15050565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103a49061108d565b60405180910390fd5b60038001546003600201546103c291906110d8565b3414610403576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103fa90611155565b60405180910390fd5b600160036004015f6101000a81548160ff021916908315150217905550565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104f2906111e3565b60405180910390fd5b60036004015f9054906101000a900460ff1661054c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105439061124b565b60405180910390fd5b6001600360040160016101000a81548160ff0219169083151502179055507f4525af7917994795b47eb2c870945f7b3544b98c90c2aaa29ea0b603eafbd61360405160405180910390a1565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461064a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106419061108d565b60405180910390fd5b6040518060c001604052808381526020018281526020015f81526020015f81526020015f151581526020015f151581525060035f820151815f0190816106909190611463565b506020820151816001015560408201518160020155606082015181600301556080820151816004015f6101000a81548160ff02191690831515021790555060a08201518160040160016101000a81548160ff0219169083151502179055509050507f9ccbe3979af10dcf0549fc70d88beed1676fee52721e2fbbd5f3e3da58b032718282604051610722929190611532565b60405180910390a15050565b6003805f01805461073e90611296565b80601f016020809104026020016040519081016040528092919081815260200182805461076a90611296565b80156107b55780601f1061078c576101008083540402835291602001916107b5565b820191905f5260205f20905b81548152906001019060200180831161079857829003601f168201915b505050505090806001015490806002015490806003015490806004015f9054906101000a900460ff16908060040160019054906101000a900460ff16905086565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610885576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161087c9061108d565b60405180910390fd5b600360040160019054906101000a900460ff166108d7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108ce906115aa565b60405180910390fd5b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60036002015490811502906040515f60405180830381858888f1935050505015801561093e573d5f803e3d5ffd5b5060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc600380015490811502906040515f60405180830381858888f193505050501580156109a7573d5f803e3d5ffd5b5060035f8082015f6109b99190610b1e565b600182015f9055600282015f9055600382015f9055600482015f6101000a81549060ff02191690556004820160016101000a81549060ff02191690555050565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610a86576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7d90610f70565b60405180910390fd5b60036004015f9054906101000a900460ff16610ad7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ace9061124b565b60405180910390fd5b7fd2e2a5987d22e8d953aa469739cd4c650bbe42acfd0ca0cc77ae6a1d7c237ac6600360020154600380015483604051610b13939291906115c8565b60405180910390a150565b508054610b2a90611296565b5f825580601f10610b3b5750610b58565b601f0160209004905f5260205f2090810190610b579190610b5b565b5b50565b5b80821115610b72575f815f905550600101610b5c565b5090565b5f604051905090565b5f80fd5b5f80fd5b5f819050919050565b610b9981610b87565b8114610ba3575f80fd5b50565b5f81359050610bb481610b90565b92915050565b5f8060408385031215610bd057610bcf610b7f565b5b5f610bdd85828601610ba6565b9250506020610bee85828601610ba6565b9150509250929050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610c2182610bf8565b9050919050565b610c3181610c17565b82525050565b5f602082019050610c4a5f830184610c28565b92915050565b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b610c9e82610c58565b810181811067ffffffffffffffff82111715610cbd57610cbc610c68565b5b80604052505050565b5f610ccf610b76565b9050610cdb8282610c95565b919050565b5f67ffffffffffffffff821115610cfa57610cf9610c68565b5b610d0382610c58565b9050602081019050919050565b828183375f83830152505050565b5f610d30610d2b84610ce0565b610cc6565b905082815260208101848484011115610d4c57610d4b610c54565b5b610d57848285610d10565b509392505050565b5f82601f830112610d7357610d72610c50565b5b8135610d83848260208601610d1e565b91505092915050565b5f8060408385031215610da257610da1610b7f565b5b5f83013567ffffffffffffffff811115610dbf57610dbe610b83565b5b610dcb85828601610d5f565b9250506020610ddc85828601610ba6565b9150509250929050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f610e1882610de6565b610e228185610df0565b9350610e32818560208601610e00565b610e3b81610c58565b840191505092915050565b610e4f81610b87565b82525050565b5f8115159050919050565b610e6981610e55565b82525050565b5f60c0820190508181035f830152610e878189610e0e565b9050610e966020830188610e46565b610ea36040830187610e46565b610eb06060830186610e46565b610ebd6080830185610e60565b610eca60a0830184610e60565b979650505050505050565b5f60208284031215610eea57610ee9610b7f565b5b5f610ef784828501610ba6565b91505092915050565b7f4f6e6c7920746865206d616e7566616374757265722063616e2063616c6c20745f8201527f6869732066756e6374696f6e2e00000000000000000000000000000000000000602082015250565b5f610f5a602d83610df0565b9150610f6582610f00565b604082019050919050565b5f6020820190508181035f830152610f8781610f4e565b9050919050565b7f4f7264657220616c726561647920706169642e000000000000000000000000005f82015250565b5f610fc2601383610df0565b9150610fcd82610f8e565b602082019050919050565b5f6020820190508181035f830152610fef81610fb6565b9050919050565b5f6040820190506110095f830185610e46565b6110166020830184610e46565b9392505050565b7f4f6e6c79207468652072657461696c65722063616e2063616c6c2074686973205f8201527f66756e6374696f6e2e0000000000000000000000000000000000000000000000602082015250565b5f611077602983610df0565b91506110828261101d565b604082019050919050565b5f6020820190508181035f8301526110a48161106b565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6110e282610b87565b91506110ed83610b87565b9250828201905080821115611105576111046110ab565b5b92915050565b7f496e636f7272656374207061796d656e7420616d6f756e742e000000000000005f82015250565b5f61113f601983610df0565b915061114a8261110b565b602082019050919050565b5f6020820190508181035f83015261116c81611133565b9050919050565b7f4f6e6c792074686520636f75726965722063616e2063616c6c207468697320665f8201527f756e6374696f6e2e000000000000000000000000000000000000000000000000602082015250565b5f6111cd602883610df0565b91506111d882611173565b604082019050919050565b5f6020820190508181035f8301526111fa816111c1565b9050919050565b7f4f72646572206e6f742070616964207965742e000000000000000000000000005f82015250565b5f611235601383610df0565b915061124082611201565b602082019050919050565b5f6020820190508181035f83015261126281611229565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806112ad57607f821691505b6020821081036112c0576112bf611269565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026113227fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826112e7565b61132c86836112e7565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61136761136261135d84610b87565b611344565b610b87565b9050919050565b5f819050919050565b6113808361134d565b61139461138c8261136e565b8484546112f3565b825550505050565b5f90565b6113a861139c565b6113b3818484611377565b505050565b5b818110156113d6576113cb5f826113a0565b6001810190506113b9565b5050565b601f82111561141b576113ec816112c6565b6113f5846112d8565b81016020851015611404578190505b611418611410856112d8565b8301826113b8565b50505b505050565b5f82821c905092915050565b5f61143b5f1984600802611420565b1980831691505092915050565b5f611453838361142c565b9150826002028217905092915050565b61146c82610de6565b67ffffffffffffffff81111561148557611484610c68565b5b61148f8254611296565b61149a8282856113da565b5f60209050601f8311600181146114cb575f84156114b9578287015190505b6114c38582611448565b86555061152a565b601f1984166114d9866112c6565b5f5b82811015611500578489015182556001820191506020850194506020810190506114db565b8683101561151d5784890151611519601f89168261142c565b8355505b6001600288020188555050505b505050505050565b5f6040820190508181035f83015261154a8185610e0e565b90506115596020830184610e46565b9392505050565b7f4f72646572206e6f742064656c697665726564207965742e00000000000000005f82015250565b5f611594601883610df0565b915061159f82611560565b602082019050919050565b5f6020820190508181035f8301526115c181611588565b9050919050565b5f6060820190506115db5f830186610e46565b6115e86020830185610e46565b6115f56040830184610e46565b94935050505056fea2646970667358221220ed36286daae7d3adcf468ffca60482bb681370274e36b4fc7127b85d6c77485764736f6c634300081a0033", // Replace with your contract's bytecode
        arguments: [retailer, courier],
      })
        .send({ from: manufacturer })
        .on("receipt", (receipt) => {
          contractAddress = receipt.contractAddress;
          contract = new web3.eth.Contract(contractABI, contractAddress);
          updateStatus(
            `Contract deployed successfully at ${contractAddress}`,
            false,
            "deploymentStatus"
          );
        });
    } catch (error) {
      updateStatus(`Deployment failed: ${error.message}`, true, "deploymentStatus");
    }
  });
  
  
  // Contract Actions
  document.getElementById("sendOrder").addEventListener("click", async () => {
    const product = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;
  
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.sendOrder(product, quantity).send({ from: accounts[0] });
      updateStatus("Order sent successfully.");
    } catch (error) {
      updateStatus(`Failed to send order: ${error.message}`, true);
    }
  });
  
  document.getElementById("setPrices").addEventListener("click", async () => {
    const orderPrice = web3.utils.toWei(document.getElementById("orderPrice").value, "ether");
    const shipmentPrice = web3.utils.toWei(document.getElementById("shipmentPrice").value, "ether");
  
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.setPrices(orderPrice, shipmentPrice).send({ from: accounts[0] });
      updateStatus("Prices set successfully.");
    } catch (error) {
      updateStatus(`Failed to set prices: ${error.message}`, true);
    }
  });
  
  document.getElementById("makePayment").addEventListener("click", async () => {
    try {
      const totalPrice = await contract.methods.orderPrice().call();
      const shipmentPrice = await contract.methods.shipmentPrice().call();
  
      const accounts = await web3.eth.getAccounts();
      await contract.methods.makePayment().send({
        from: accounts[0],
        value: web3.utils.toBN(totalPrice).add(web3.utils.toBN(shipmentPrice)).toString(),
      });
      updateStatus("Payment made successfully.");
    } catch (error) {
      updateStatus(`Payment failed: ${error.message}`, true);
    }
  });
  
  document.getElementById("sendInvoice").addEventListener("click", async () => {
    try {
      const invoiceData = "Sample Invoice Data";
      const deliveryDate = Math.floor(Date.now() / 1000) + 86400; // 1 day later
  
      const accounts = await web3.eth.getAccounts();
      await contract.methods.sendInvoice(invoiceData, deliveryDate).send({ from: accounts[0] });
      updateStatus("Invoice sent successfully.");
    } catch (error) {
      updateStatus(`Failed to send invoice: ${error.message}`, true);
    }
  });
  
  document.getElementById("confirmDelivery").addEventListener("click", async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.confirmDelivery().send({ from: accounts[0] });
      updateStatus("Delivery confirmed successfully.");
    } catch (error) {
      updateStatus(`Failed to confirm delivery: ${error.message}`, true);
    }
  });
  
  document.getElementById("finalizeOrder").addEventListener("click", async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.finalizeOrder().send({ from: accounts[0] });
      updateStatus("Order finalized successfully.");
    } catch (error) {
      updateStatus(`Failed to finalize order: ${error.message}`, true);
    }
  });
  
  // Get Contract Balance
  document.getElementById("getBalance").addEventListener("click", async () => {
    try {
      const balance = await web3.eth.getBalance(contractAddress);
      document.getElementById("balanceOutput").innerText = `Balance: ${web3.utils.fromWei(balance, "ether")} ETH`;
    } catch (error) {
      updateStatus(`Failed to fetch balance: ${error.message}`, true);
    }
  });
  