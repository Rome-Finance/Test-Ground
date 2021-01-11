
const { assert } = require('chai')
const ganache = require("ganache-cli"); //a bunch of imports, some probably arent necessary
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);


const PoolManager = artifacts.require('PoolManager')

require('chai') //chai is an assertion library
    .use(require('chai-as-promised')) //chai does assertions for asynchronous behaviour
    .should() // tells chai how to behave or something

contract('PoolManager', (accounts) => {

    describe('PoolManager deployment', async () => {
        it('has correct owner', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            let regionOwner = await theEmpire.getRegionOwner()
            assert.equal(accounts[0], regionOwner)
        })


        it('has correct region name', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            let regionName = await theEmpire.getRegionName()
            assert.equal("the empire", regionName)
        })

        it('does accounts[0] deploy contract', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            let owner = await theEmpire.owner()
            assert.equal(accounts[0], owner)
        })
    })
})