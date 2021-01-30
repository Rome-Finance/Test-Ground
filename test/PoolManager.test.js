
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
            //console.log("here1")
            let wasApproved = await theEmpire.isPoolApproved(testPool.address)
            //console.log(wasApproved)
            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            //console.log("here2")
            let owner = await stratControl.owner();
            //console.log(owner)
            //console.log(accounts[0])

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)

            //console.log("here3")
            owner = await stratControl.owner()
            //console.log(owner)
            //console.log(accounts[0])

            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })

            owner = await stratControl.owner()
            //console.log(owner)
            //console.log(accounts[0])

            //console.log("here4")
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            //console.log("here5")
            //console.log(cur_strat_interface.address)
            //console.log(j_store_it_strat.address)
            assert.equal(cur_strat, j_store_it_strat.address)

        })


        it('can deposit fund to pool after setting strategy first time', async () => {
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

            await romeTok.mint(1000000)

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            let owner = await stratControl.owner();

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            owner = await stratControl.owner()
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            owner = await stratControl.owner()
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 10000)
            //console.log("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            assert.equal(funds, 10000)
        })

        it('can withdraw funds after depositing into pool, setting strategy only once, no old strategy', async () => {
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

            await romeTok.mint(1000000)

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            let owner = await stratControl.owner();

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            owner = await stratControl.owner()
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            owner = await stratControl.owner()
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 10000)
            //console.log("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            assert.equal(funds, 10000)
            let userBal = await testPool.balanceOf(accounts[0])
            //console.log(userBal)
            await theEmpire.withdrawFromPool(testPool.address, 10000)
            funds = await cur_strat_interface.totalBalance()
            assert.equal(funds, 0)

        })

        it('deposit, change strategy, then withdraw. No money should be lost. 1 user only in this test', async () => {
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

            await romeTok.mint(1000000)

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItStrategy.new(romeTok.address, testPool.address)
            let owner = await stratControl.owner();

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 1000000)

            //console.log("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            assert.equal(funds, 10000)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })

            await testPool.moveToNewStrategy(3000)

            //console.log("after move")

            await theEmpire.withdrawFromPool(testPool.address, 10000, {
                from: accounts[0],
                gas: "3000000"
            })

            let bal = await testPool.balanceOf(accounts[0])
            //console.log(bal)
            assert.equal(bal, 0)
            bal = await romeTok.balanceOf(accounts[0])
            //console.log(bal)
            assert.equal(bal,1000000)
        })

        it('deposit, change strategy, then withdraw. No money should be lost. 3 users in this test', async () => {
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

            await romeTok.mint(1000000)
            await romeTok.mint(1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.mint(1000000, {
                from: accounts[2],
                gas: "1000000"
            })

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 10000)
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[2],
                gas: "1000000"
            })
            //console.log("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[1],
                gas: "2000000"
            })
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[2],
                gas: "2000000"
            })
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            assert.equal(funds, 30000)


            funds = await testPool.balanceOf(accounts[0])
            //console.log("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            //console.log("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            //console.log("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })

            await testPool.moveToNewStrategy(10000)

            // console.log("after move")

            await theEmpire.withdrawFromPool(testPool.address, 10000, {
                from: accounts[0],
                gas: "3000000"
            })

            let bal = await testPool.balanceOf(accounts[0])
            // console.log("user1" + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            //  console.log("user1 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 10000, {
                from: accounts[1],
                gas: "3000000"
            })

            bal = await testPool.balanceOf(accounts[1])
            // console.log("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            // console.log("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 10000, {
                from: accounts[2],
                gas: "3000000"
            })
            bal = await testPool.balanceOf(accounts[2])
            // console.log("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            // console.log("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');
        })
    })

    describe('Strategy interaction', async () => {

        it('deposit, change strategy, then withdraw. 3 users, 1:.5 strategy value ratio', async () => {
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

            await romeTok.mint(1000000)
            await romeTok.mint(1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.mint(1000000, {
                from: accounts[2],
                gas: "1000000"
            })

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 10000)
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[2],
                gas: "1000000"
            })
            //console.log("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[1],
                gas: "2000000"
            })
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[2],
                gas: "2000000"
            })
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            funds.should.be.a.bignumber.that.closeTo(new BN(15000), '0')


            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })

            await testPool.moveToNewStrategy(10000)

            //console.log("after move")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user1 before withdraw" + bal)
            bal = await cur_strat_interface.totalBalance()
            dprint("user1 before withdraw strat old balance " + bal)
            bal = await j_store_it_strat_new.totalBalance()
            dprint("user1 before withdraw strat new balance " + bal)
            bal = await romeTok.balanceOf(testPool.address)
            dprint("user1 before withdraw pool contract bal " + bal)


            await theEmpire.withdrawFromPool(testPool.address, 5000, {
                from: accounts[0],
                gas: "3000000"
            })


            bal = await testPool.balanceOf(accounts[0])
            dprint("user1" + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user1 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 5000, {
                from: accounts[1],
                gas: "3000000"
            })

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 5000, {
                from: accounts[2],
                gas: "3000000"
            })
            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');
        })

        it('deposit, change strategy, then withdraw. 3 users, 1:.2 on first strat, 1:.5 on second strat value ratio to staking token, bigger ratio to smaller ratio test', async () => {
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

            await romeTok.mint(1000000)
            await romeTok.mint(1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.mint(1000000, {
                from: accounts[2],
                gas: "1000000"
            })

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButFifthStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 10000)
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[1],
                gas: "1000000"
            })
            await romeTok.approve(theEmpire.address, 1000000, {
                from: accounts[2],
                gas: "1000000"
            })
            dprint("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[1],
                gas: "2000000"
            })
            await theEmpire.depositToPool(testPool.address, 10000, {
                from: accounts[2],
                gas: "2000000"
            })
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            //funds.should.be.a.bignumber.that.closeTo(new BN(15000), '0')


            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {
                from: accounts[0],
                gas: "1000000"
            })

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {
                from: accounts[0],
                gas: "2000000"
            })

            await testPool.moveToNewStrategy(2500)

            dprint("after move")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user1 before withdraw" + bal)
            bal = await cur_strat_interface.totalBalance()
            dprint("user1 before withdraw strat old balance " + bal)
            bal = await j_store_it_strat_new.totalBalance()
            dprint("user1 before withdraw strat new balance " + bal)
            bal = await romeTok.balanceOf(testPool.address)
            dprint("user1 before withdraw pool contract bal " + bal)


            await theEmpire.withdrawFromPool(testPool.address, 2000, {
                from: accounts[0],
                gas: "3000000"
            })


            bal = await testPool.balanceOf(accounts[0])
            dprint("user1" + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user1 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 2000, {
                from: accounts[1],
                gas: "3000000"
            })

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 2000, {
                from: accounts[2],
                gas: "3000000"
            })
            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');
        })

        it('deposit withdraw 1/2 withdraw 1/2 from 4 accounts, with two movetoNewPool called between deposit, and between the 2 withdraw blocks', async () => {
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

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {from: accounts[0], gas: "1000000"})

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 1000000)
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[2], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[3], gas: "1000000"})
            dprint("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            await theEmpire.depositToPool(testPool.address, 10000, {from: accounts[1], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 10000, {from: accounts[2], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 10000, {from: accounts[3], gas: "2000000"})



            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {from: accounts[0], gas: "1000000"})
            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            await testPool.moveToNewStrategy(5000)

            dprint("after move")

            await logAccountBalances(accounts, 4, testPool)

            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool)

            await testPool.moveToNewStrategy(5000)

            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 2500, {from: accounts[3], gas: "3000000"})

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10')
        })

        it('deposit, change strategy, then withdraw. 3 users, 1:.5 to 1:.2 strat, smaller ratio to bigger ratio test', async () => {
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

            let wasApproved = await theEmpire.isPoolApproved(testPool.address)

            assert.equal(true, wasApproved)
            let j_store_it_strat = await justStoreItButHalfStrategy.new(romeTok.address, testPool.address)
            let j_store_it_strat_new = await justStoreItButFifthStrategy.new(romeTok.address, testPool.address)

            await stratControl.startTimelock(testPool.address, j_store_it_strat.address, {from: accounts[0], gas: "1000000"})

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})
            let cur_strat = await testPool.getCurrentStrategy()
            let cur_strat_interface = await IStrategy.at(cur_strat)
            assert.equal(cur_strat, j_store_it_strat.address)
            //console.log("here0")
            await romeTok.approve(theEmpire.address, 1000000)
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[1], gas: "1000000"})
            await romeTok.approve(theEmpire.address, 1000000, {from: accounts[2], gas: "1000000"})
            dprint("here.5")
            //console.log(testPool.address)
            await theEmpire.depositToPool(testPool.address, 10000)
            await theEmpire.depositToPool(testPool.address, 10000, {from: accounts[1], gas: "2000000"})
            await theEmpire.depositToPool(testPool.address, 10000, {from: accounts[2], gas: "2000000"})
            //console.log("here")
            let funds = await cur_strat_interface.totalBalance()
            //console.log(funds)
            //unds.should.be.a.bignumber.that.closeTo(new BN(15000), '0')


            funds = await testPool.balanceOf(accounts[0])
            dprint("u1 " + funds)
            funds = await testPool.balanceOf(accounts[1])
            dprint("u2 " + funds)
            funds = await testPool.balanceOf(accounts[2])
            dprint("u3 " + funds)

            await stratControl.startTimelock(testPool.address, j_store_it_strat_new.address, {from: accounts[0], gas: "1000000"})

            await timeMachine.advanceTimeAndBlock(1000)
            await stratControl.deployAfterTimelock(testPool.address, {from: accounts[0], gas: "2000000"})

            await testPool.moveToNewStrategy(10000)

            dprint("after move")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user1 before withdraw" + bal)
            bal = await cur_strat_interface.totalBalance()
            dprint("user1 before withdraw strat old balance " + bal)
            bal = await j_store_it_strat_new.totalBalance()
            dprint("user1 before withdraw strat new balance " + bal)
            bal = await romeTok.balanceOf(testPool.address)
            dprint("user1 before withdraw pool contract bal " + bal)


            await theEmpire.withdrawFromPool(testPool.address, 5000, {from: accounts[0], gas: "3000000"})


            bal = await testPool.balanceOf(accounts[0])
            dprint("user1" + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user1 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 5000, {from: accounts[1], gas: "3000000"})

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            await theEmpire.withdrawFromPool(testPool.address, 5000, {from: accounts[2], gas: "3000000"})
            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');
        })

        it('users withdraw when funds are halfway between pools. No money should be lost', async () => {
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

            await testPool.moveToNewStrategy(100000)

            dprint("after move")

            await logAccountBalances(accounts, 4, testPool)

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after uniform withdraw")

            await testPool.moveAllToNewStrategy()

            dprint("hhhhhhere")

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[0], gas: "3000000"})
            dprint("hhhhhhere1")
            await theEmpire.depositToPool(testPool.address, 25000, {from: accounts[1], gas: "3000000"})
            dprint("hhhhhhere2")
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[2], gas: "3000000"})
            dprint("hhhhhhere3")
            await theEmpire.depositToPool(testPool.address, 25000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after randomly assigned desposit or withdraw")

            await theEmpire.withdrawFromPool(testPool.address, 37500, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 37500, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, romeTok, "after final withdraw of all money")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10')
        })

        it('make sure deposit is properly reject while pool is locked to move funds, and withdraw works normally and all funds can still be emptied, region manager cannot lock peoples funds forever with move', async () => {
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

            await testPool.moveToNewStrategy(100000)

            dprint("after move")

            await logAccountBalances(accounts, 4, testPool)

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[0], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[2], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after uniform withdraw")

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[0], gas: "3000000"})

            await theEmpire.depositToPool(testPool.address, 25000, {from: accounts[1], gas: "3000000"}).should.be.rejectedWith("deposits are disabled temporarily because contract is migrating strategies. Withdraws will work as normal.");

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[2], gas: "3000000"})

            await theEmpire.depositToPool(testPool.address, 25000, {from: accounts[3], gas: "3000000"}).should.be.rejectedWith("deposits are disabled temporarily because contract is migrating strategies. Withdraws will work as normal.");

            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[1], gas: "3000000"})
            await theEmpire.withdrawFromPool(testPool.address, 25000, {from: accounts[3], gas: "3000000"})

            await logAccountBalances(accounts, 4, testPool, "after randomly assigned desposit or withdraw")

            let bal = await testPool.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[0])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[1])
            dprint("user2 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[2])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10');

            bal = await testPool.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(0), '10');
            bal = await romeTok.balanceOf(accounts[3])
            dprint("user3 " + bal)
            bal.should.be.a.bignumber.that.closeTo(new BN(1000000), '10')

        })

    })

})