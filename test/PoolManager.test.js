
const { assert } = require('chai')
const ganache = require("ganache-cli"); //a bunch of imports, some probably arent necessary
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);


const PoolManager = artifacts.require('PoolManager')
const Pool = artifacts.require('Pool')

require('chai') //chai is an assertion library
    .use(require('chai-as-promised')) //chai does assertions for asynchronous behaviour
    .should() // tells chai how to behave or something

const ERROR_MSG = 'VM Exception while processing transaction: revert';

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
            let owner = await theEmpire.owner();
            assert.equal(accounts[0], owner)
            //console.log(owner)
        })

        it('renounce ownership works', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            //below is syntax to set account and gas. add json arg after regular args of function
            await theEmpire.renounceOwnership({
                from: accounts[0],
                gas: "1000000"
            });
            let owner = await theEmpire.owner();
            assert.equal(owner, "0x0000000000000000000000000000000000000000")
            //console.log(accounts[0])
            //console.log(owner)
        })

        it('transfer region owner legit', async () => {
            let theEmpire = await PoolManager.new(accounts[1], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            //below is syntax to set account and gas. add json arg after regular args of function
            await theEmpire.transferRegionOwner( accounts[2], {
                from: accounts[1],
                gas: "1000000"
            });
            let reg_owner = await theEmpire.getRegionOwner();
            assert.equal(reg_owner, accounts[2])
            //console.log(accounts[0])
            //console.log(owner)
        })
        it('transfer region owner malicious 1', async () => {
            let theEmpire = await PoolManager.new(accounts[1], "the empire") //im not sure which account is consider the deployer for owner purposes when .new() is called
            //below is syntax to set account and gas. add json arg after regular args of function
            await theEmpire.transferRegionOwner( accounts[2], {
                from: accounts[2],
                gas: "1000000"
            }).should.be.rejectedWith(ERROR_MSG);
            let reg_owner = await theEmpire.getRegionOwner();
            //assert.equal(reg_owner, accounts[2])
            //console.log(accounts[0])
            //console.log(owner)
        })
    })
})