
const { assert } = require('chai')
const ganache = require("ganache-cli"); //a bunch of imports, some probably arent necessary
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);


const PoolManager = artifacts.require('PoolManager')
const Pool = artifacts.require('Pool')
const Rome = artifacts.require('Rome')
const justStoreItStrategy = artifacts.require('justStoreItStrategy')
const StrategyController = artifacts.require('StrategyControler')

require('chai') //chai is an assertion library
    .use(require('chai-as-promised')) //chai does assertions for asynchronous behaviour
    .should() // tells chai how to behave or something

const ERROR_MSG = 'VM Exception while processing transaction: revert';

const callback = function() {
    console.log("callback called");
}

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

    describe('Pool Interaction', async () => {
        it('can approve a pool', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire", {
                from: accounts[0],
                gas: "1000000"
            }) //im not sure which account is consider the deployer for owner purposes when .new() is called
            let romeTok = await Rome.new()
            let stratControl = await StrategyController.new(0)
            let testPool = await Pool.new("test pool", "TPOL", romeTok.address, stratControl.address, theEmpire.address)
            await theEmpire.approvePool(testPool.address, {
                from: accounts[0],
                gas: "1000000"
            })
            let wasApproved = await theEmpire.isPoolApproved(testPool.address)
            assert.equal(true, wasApproved)
        })
        it('non regionOwner cannot approve pool', async () => {
            let theEmpire = await PoolManager.new(accounts[1], "the empire", {
                from: accounts[0],
                gas: "1000000"
            }) //accounts[0] usually is deployer if you dont specify. I think it might just the the default for everything that would make sense
            let romeTok = await Rome.new()
            let stratControl = await StrategyController.new(0)
            let testPool = await Pool.new("test pool", "TPOL", romeTok.address, stratControl.address, theEmpire.address)
            await theEmpire.approvePool(testPool.address, {
                from: accounts[0],
                gas: "1000000"
            }).should.be.rejectedWith(ERROR_MSG);
            let wasApproved = await theEmpire.isPoolApproved(testPool.address)
            assert.equal(false, wasApproved)
        })

        it('strategy controler able to deploy strategy (with 0 for timelock)', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire", {
                from: accounts[0],
                gas: "1000000"
            }) //accounts[0] usually is deployer if you dont specify. I think it might just the the default for everything that would make sense
            let romeTok = await Rome.new()
            let stratControl = await StrategyController.new(0, {
                from: accounts[0],
                gas: "1000000"
            })
            let testPool = await Pool.new("test pool", "TPOL", romeTok.address, stratControl.address, theEmpire.address)
            await theEmpire.approvePool(testPool.address, {
                from: accounts[0],
                gas: "1000000"
            })
            console.log("here1")
            let wasApproved = await theEmpire.isPoolApproved(testPool.address)
            console.log(wasApproved)
            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            console.log("here2")
            let owner = await stratControl.owner();
            console.log(owner)
            console.log(accounts[0])
            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })
            await web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_increaseTime",
                params: [600],
                id: 123
            }, callback)
            await web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                id: 123
            }, callback)
            console.log("here3")
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            console.log("here4")
            let cur_strat = testPool.getCurrentStrategy()
            console.log("here5")
            assert.equal(cur_strat, j_store_it_strat)
        })
    })
})