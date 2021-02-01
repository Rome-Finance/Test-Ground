
const { assert } = require('chai')
const ganache = require("ganache-cli"); //a bunch of imports, some probably arent necessary
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);


const PoolManager = artifacts.require('PoolManager')
const Pool = artifacts.require('Pool')
const Rome = artifacts.require('Rome')
const justStoreItStrategy = artifacts.require('justStoreItStrategy')
const justStoreItButHalfStrategy = artifacts.require('justStoreItButHalfStrategy')
const justStoreItButFifthStrategy = artifacts.require('justStoreItButFifthStrategy')
const StrategyController = artifacts.require('StrategyControler')
const IStrategy = artifacts.require('IStrategy')

const timeMachine = require('ganache-time-traveler');

const BN = require('bn.js');

const chai = require('chai') //chai is an assertion library
chai.use(require('chai-bn')(BN), require('chai-as-promised'))
//chai.use(require('chai-as-promised')) //chai does assertions for asynchronous behaviour
chai.should() // tells chai how to behave or something


const ERROR_MSG = 'VM Exception while processing transaction: revert';

const debug = true;

const logAccountBalances = async function(accounts, numToFetch, tokenContract, title = "account balances") {
    if (debug){
        console.log(title)
        let tokenName = await tokenContract.name()
        for (let i = 0; i < numToFetch; i++) {
            let balance = await tokenContract.balanceOf(accounts[i])
            console.log("Account " + i + " balance of " + tokenName + " : " + balance)
        }
        console.log("\n")
    }
}

const dprint = function(message){
    if (debug){
        console.log(message);
    }
}

contract('Strategy Tests', (accounts) => {

    describe('More Complex Strategy Simulation', async () => {


        it('test strategy changing value, gets bigger', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire", {
                from: accounts[0],
                gas: "1000000"
            }) //accounts[0] usually is deployer if you dont specify. I think it might just the the default for everything that would make sense
            let romeTok = await Rome.new()
            let stratControl = await StrategyController.new(0, {from: accounts[0], gas: "1000000"})
            let testPool = await Pool.new("test pool", "TPOL", romeTok.address, stratControl.address, theEmpire.address)
            await theEmpire.approvePool(testPool.address, {from: accounts[0], gas: "1000000"})

            await romeTok.mint(1000000)
            await romeTok.mint(1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[2], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[3], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[5], gas: "1000000"})

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {from: accounts[0], gas: "1000000"})

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            let cur_strat = await testPool.getCurrentStrategy()
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 1000000)
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[2], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[3], gas: "1000000"})
            dprint("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 100000)
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[1], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[2], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[3], gas: "2000000"})



            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {from: accounts[0], gas: "1000000"})
            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            await testPool.moveToNewStrategy(200000)

            dprint("after move")

            await logAccountBalances(accounts, 4, testPool)

            await romeTok.transfer(j_store_it_strat_new.address, 400000, {from: accounts[5], gas: "1000000"})

            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after randomly assigned desposit or withdraw")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1100000), '10');

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1100000), '10');

            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1100000), '10');

            bal = await testPool.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1100000), '10')

        })

        it('test strategy changing value, gets smaller, ie loses money', async () => {
            let theEmpire = await PoolManager.new(accounts[0], "the empire", {
                from: accounts[0],
                gas: "1000000"
            }) //accounts[0] usually is deployer if you dont specify. I think it might just the the default for everything that would make sense
            let romeTok = await Rome.new()
            let stratControl = await StrategyController.new(0, {from: accounts[0], gas: "1000000"})
            let testPool = await Pool.new("test pool", "TPOL", romeTok.address, stratControl.address, theEmpire.address)
            await theEmpire.approvePool(testPool.address, {from: accounts[0], gas: "1000000"})

            await romeTok.mint(1000000)
            await romeTok.mint(1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[2], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[3], gas: "1000000"})
            await romeTok.mint(1000000, {from: accounts[5], gas: "1000000"})

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {from: accounts[0], gas: "1000000"})

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            let cur_strat = await testPool.getCurrentStrategy()
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 1000000)
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[2], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[3], gas: "1000000"})
            dprint("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 100000)
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[1], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[2], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 100000, {from: accounts[3], gas: "2000000"})



            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {from: accounts[0], gas: "1000000"})
            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            await testPool.moveToNewStrategy(200000)

            dprint("after move")

            await logAccountBalances(accounts, 4, testPool)

            await j_store_it_strat_new.loseMoney(200000, {from: accounts[6], gas: "3000000"})

            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 50000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after randomly assigned desposit or withdraw")
            await logAccountBalances(accounts, 4, romeTok, "after randomly assigned desposit or withdraw")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(950000), '10');

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(950000), '10');

            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(950000), '10');

            bal = await testPool.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(950000), '10')

        })

    })

})