
const { assert } = require('chai')
const ganache = require("ganache-cli"); //a bunch of imports, some probably arent necessary
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);


const Rome = artifacts.require('Rome')

require('chai') //chai is an assertion library
    .use(require('chai-as-promised')) //chai does assertions for asynchronous behaviour
    .should()

contract('Rome', (accounts) => {

    describe('Mock Rome deployment', async () => {
        it('has a name', async () => {
            let roma = await Rome.new() //creates a new instance of a contract
            let name = await roma.name() //apparently you can just use the . and method name for contract method
            assert.equal(name, 'Rome')
        })
    })
})