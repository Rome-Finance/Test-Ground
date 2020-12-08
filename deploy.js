const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

//                          account mneomnic & infura link
//                          ------------------------------
const provider = new HDWalletProvider(
    'powder wing nation fatal wire arrow sleep urge bounce climb enhance grab',
    'https://rinkeby.infura.io/v3/aeae6650ef0d4eebbddd762a049146a8'            
);

const web3 = new Web3(provider);

// deloy() only purpose is so we cant use await
// --------------------------------------------

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    
// truffle-hdwallet-provider version 0.0.3
//  ---------------------------------------
    
result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({gas: '1000000', from: accounts[0]});

    console.log('Contact deployed to', result.options.address);
};

//                              truffle-hdwallet-provider versions 0.0.4, 0.0.5 and 0.0.6  
//                              ---------------------------------------------------------
//   const result = await new web3.eth.Contract(JSON.parse(interface))
//     .deploy({data: '0x' + bytecode, arguments: ['Hi there!']}) // add 0x bytecode
//     .send({from: accounts[0]}); // remove 'gas'\

deploy();