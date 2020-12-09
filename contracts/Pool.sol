pragma solidity =0.7.5;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC20/IERC20.sol";
import "./PoolManager.sol";
import "./IStrategy.sol";

contract Pool is ERC20 {
    using SafeMath for uint256;

    address PoolManager;
    address StrategyControler;
    IStrategy currentStrategy;
    IERC20 stakingToken;

    /*
    some sort of control mechanism to remember whether a user should withdraw from strategy itself, or from balance of this contract
    when a strategy changes, the withdrawAll function should be called to return all funds to this pool.
    */



    constructor(string memory name, string memory symbol, address stakTok, address SC)
    ERC20(name, symbol) public {
        stakingToken = IERC20(stakTok);
        StrategyControler = SC;
    }


    function setStrategy(IStrategy newStrategy) public{
        require(msg.sender == StrategyControler, "Only the StrategyControler contract can change the strategy");

        //withdraw all funds from old strategy. keep them in the balance of this contract, or have mechanism to invest them into the next strategy all at once
        //probable also needs logic to make sure that this contract will be authorized by the strategy to do withdraw all
        //maybe some logic that checks "controller" of strategy, and makes sure it is set to this pool in strategy controller
        currentStrategy.withdrawAll();

        //set new strategy. This will change what happens when users deposit into this pool, the new strategy will be called to deposit into new strategy's logic
        currentStrategy = newStrategy;

        //deposit all balance into new strategy
        currentStrategy.deposit(stakingToken.balanceOf(address(this))); //everything sitting in this contract? put capital immeadiatly into new strategy??
    }

    function deposit(address user, uint256 amount) public{ //amount here is in staking token. DIFFERENT BETWEEN WITHDRAW AND STAKE
        //@todo make this function actually transfer the tokens to this contract

        require(msg.sender == PoolManager);

        //@to done make this scale to the users share of the pool, then mint tokens equal to user share of pool

        uint256 strategy_balance_before = currentStrategy.balanceOf();

        currentStrategy.deposit(amount);

        uint256 strategy_balance_after = currentStrategy.balanceOf();

        uint256 user_strategy_tokens = strategy_balance_before - strategy_balance_after; // see how much the strategy token changed based on the user's deposit

        uint256 tokens_to_mint_user = (totalSupply() * user_strategy_tokens) / strategy_balance_after;

        _mint(user, tokens_to_mint_user);
    }

    function withdraw(address user, uint256 amount) public{//amount here is in pool token. DIFFERENT BETWEEN WITHDRAW AND STAKE
        //@todo make this scale to users share of the pool

        require(msg.sender == PoolManager);

        require(balanceOf(user) > amount); // make sure user owns as much as they want to withdraw

        /*
        we figure out how much to withdraw by taking the ratio of the amount requested over the total supply,
        and multiplying that by the balance of the current strategy

        we do it in a slightly different but mathmatically identical order so we dont have to deal with floats
        */
        uint256 funds_to_withdraw = (amount * currentStrategy.balanceOf()) / totalSupply();


        uint256 staking_token_balance_before = stakingToken.balanceOf(address(this));

        currentStrategy.withdraw(funds_to_withdraw);

        uint256 staking_token_balance_after = stakingToken.balanceOf(address(this));

        uint256 staking_token_gained = staking_token_balance_before - staking_token_balance_after;

        stakingToken.transfer(user, staking_token_gained);

    }

    function getToken() public view returns (IERC20){
        return stakingToken;
    }





}
