pragma solidity =0.7.5;


import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./PoolManager.sol";
import "./IStrategy.sol";


contract Pool is ERC20 {
    using SafeMath for uint256;

    PoolManager poolMAN;
    address StrategyControler;


    IStrategy currentStrategy;
    IStrategy oldStrategy;
    IERC20 stakingToken;

    //modifer that requires caller to be region owner. Each region will have its own poolmanager. Change name of pool manager to region?
    modifier onlyRegionOwner {
        require(
            msg.sender == poolMAN.getRegionOwner(),
            "Only region owner can call this function."
        );
        _;
    }

    modifier onlyStrategyController {
        require(
            msg.sender == StrategyControler,
            "Only strategy controller can call this function."
        );
        _;
    }

    /*
    some sort of control mechanism to remember whether a user should withdraw from strategy itself, or from balance of this contract
    when a strategy changes, the withdrawAll function should be called to return all funds to this pool.
    */

    /*
    pools should be deployed after pool manager and StrategyControler already exist (deployed on chain so can pass address to constructor)
    */


    /*
    use this to keep track of which strategy the user last invested into. Dont let them deposit into a new strategy until they have
    withdrawn from the old strategy
    */

    uint256 staking_token_in_old_strategy;
    uint256 staking_token_in_current_strategy;



    constructor(string memory name, string memory symbol, address stakTok, address SC, address PM)
    ERC20(name, symbol) {
        stakingToken = IERC20(stakTok);
        StrategyControler = SC;
        poolMAN = PoolManager(PM);
    }


    function setStrategy(IStrategy newStrategy) external onlyStrategyController{
        require(msg.sender == StrategyControler, "Only the StrategyControler contract can change the strategy");
        require(staking_token_in_old_strategy == 0); //make sure strategy 2 before this new one that is about to go into effect is empty of money because it will be forgotten
        require(address(newStrategy) != address(currentStrategy)); //dont let the user set the same strategy that is already in effect
        //set new strategy. This will change what happens when users deposit into this pool, the new strategy will be called to deposit into new strategy's logic
        oldStrategy = currentStrategy;
        currentStrategy = newStrategy;
        staking_token_in_old_strategy = staking_token_in_current_strategy;
        staking_token_in_current_strategy = 0;
    }

    function moveToNewStrategy(uint256 amount) external onlyRegionOwner{

        //@todo check this logic I wrote at 2 am sometime to make sure its right
        //should move money from old strategy to new, and update the money in each with the balanceOf this contract from stakingToken
        uint256 bal1 = stakingToken.balanceOf(address(this));

        //require(false, "fails here?");

        oldStrategy.withdraw(amount);

        //require(false, "made it into move");

        uint256 bal2 = stakingToken.balanceOf(address(this));
        staking_token_in_old_strategy -= bal2 - bal1;
        uint256 tokensToTransfer = bal2 - bal1;



        bal1 = stakingToken.balanceOf(address(this));
        stakingToken.transfer(address(currentStrategy), tokensToTransfer); //transfer happens outside deposit to make writing the strategy contracts easier
        currentStrategy.deposit(tokensToTransfer); //deposit actually moves the money into whereever the strategy wants it to go
        bal2 = stakingToken.balanceOf(address(this));
        staking_token_in_current_strategy += bal1 - bal2;
    }




    /*
    maybe keep running ratio of funds withdawn and put into new strategy
    then when user tries to stake more, let them stake proportionally in both, or prevent it alltogether
    */

    // function withdraw in pieces. Maybe execute ahead of strategy change? Users can get their money out based on ratio withdramn, know how
    //to withdraw proportionally?

    /*
    it seems that the yearn and harvest people might have the deposit and withdraw in an amount to slowly put things into new strategy
    manually to really manage the funds more like micromanagy. Letting them get around slippage by withdrawing and depositing
    parts of the funds slowly. Some strategies might involve going though swap pools to add liquidity in equal amounts or something,
    which would cause significant slippage in a pool if the fund size is big enough and done all at once.



    */



    function deposit(address user, uint256 amount) public{ //amount here is in staking token. DIFFERENT BETWEEN WITHDRAW AND STAKE
        //@todo make this function actually transfer the tokens to this contract


        require(msg.sender == address(poolMAN), "pool manager must deposit funds");
        require(address(currentStrategy) != 0x0000000000000000000000000000000000000000, "current address must not be zero address");

        //@todo make this scale to the users share of the pool, then mint tokens equal to user share of pool

        uint256 fundsToOldStrat;
        uint256 fundsToCurrentStrat;

        //make sure the first deposit happens without a divide by zero
        if((staking_token_in_old_strategy + staking_token_in_current_strategy) == 0){
            fundsToCurrentStrat = amount;
            fundsToOldStrat = 0;
        }
        else{
            uint256 fundsToOldStrat = (amount * staking_token_in_old_strategy) / (staking_token_in_old_strategy + staking_token_in_current_strategy);
            uint256 fundsToCurrentStrat = (amount * staking_token_in_current_strategy) / (staking_token_in_old_strategy + staking_token_in_current_strategy);
        }
        //require(false, "got to here boiiii");

        //dont try to put stuff into old strategy if there is no old strategy
        if(address(oldStrategy) != 0x0000000000000000000000000000000000000000){
            stakingToken.transferFrom(user, address(oldStrategy), fundsToOldStrat);
            oldStrategy.deposit(fundsToOldStrat);
        }


        uint256 balBefore = currentStrategy.totalBalance();
        stakingToken.transfer(address(currentStrategy), fundsToCurrentStrat);
        currentStrategy.deposit(fundsToCurrentStrat);
        uint256 balAfter = currentStrategy.totalBalance();

        uint256 tokensToMint;
        //make sure that tokens still get minted if totalSupply is 0
        if(totalSupply() != 0){
            tokensToMint = ((balAfter - balBefore) * totalSupply() ) / balBefore;
        }
        else{
            tokensToMint=(balAfter - balBefore);
        }


        _mint(user, tokensToMint);
    }

    function withdraw(address user, uint256 amount) public{//amount here is in pool token. DIFFERENT BETWEEN WITHDRAW AND STAKE
        //@to done make this scale to users share of the pool



        require(msg.sender == address(poolMAN), "withdraw can only be called through pool manager");

        require(balanceOf(user) >= amount, "user balance too low"); // make sure user owns as much as they want to withdraw

        /*
        make this withdraw some funds from old strategy and some from new strategy depending on migration state of
        funds by regionmanager from one strategy to another, in case someone withdraws while funds are moving
                    ratio of funds in old to new    *   share of users stake to withdraw    *      ratio of users investment to total pool value
        (ratio of funds in old/ total Funds in both) * ( amount / balanceOf(user) ) *    (balanceOf(user) / totalSupply())  -- how much to deposit into old. replace old with new for new in first funds ratio
        */


        //------------------------------------------------------------------------------------------------------------------------------------------------

        //uint oldToWithdraw = oldstrat.balanceOf() * ( amount / balanceOf(user) ) * (balanceOf(user) / totalSupply())
        //uint newToWithdraw = newstrat.balanceOf() * ( amount / balanceOf(user) ) * (balanceOf(user) / totalSupply())
        //the above two should work because you take the same ratio out of each equal to useres share, and the other two, even though it is in two parts, represent the money of everyone so user should get user share

        //------------------------------------------------------------------------------------------------------------------------------------------------

        uint256 starting_funds = stakingToken.balanceOf(address(this));

        uint256 oldToWithdraw;

        if(address(oldStrategy) != 0x0000000000000000000000000000000000000000){
            oldToWithdraw = (oldStrategy.totalBalance() *  amount) / (totalSupply());
            // (amount / totalSupply) * oldStrategyBalance
        }
        uint256 newToWithdraw = (currentStrategy.totalBalance() *  amount) / (totalSupply());
        // (amount / totalSupply) * currentStrategyBalance

        if(address(oldStrategy) != 0x0000000000000000000000000000000000000000){
            oldStrategy.withdraw(oldToWithdraw);
        }
        currentStrategy.withdraw(newToWithdraw);
        uint256 finish_funds = stakingToken.balanceOf(address(this));
        _burn(user, amount);
        stakingToken.transfer(user, finish_funds - starting_funds);


    }

    function getToken() public view returns (IERC20){
        return stakingToken;
    }


    //view function to get address of strategy manager contract
    function getStrategyController() public view returns (address){
        return StrategyControler;
    }

    //view function to get address of pool manager contract
    function getPoolManager() public view returns (PoolManager){
        return poolMAN;
    }

    function getCurrentStrategy() public view returns (IStrategy){
        return currentStrategy;
    }

    function getLastStrategy() public view returns (IStrategy){
        return oldStrategy;
    }




}
