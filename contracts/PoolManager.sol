pragma solidity =0.7.5;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC20/ERC20.sol";
import "./Pool.sol";

contract PoolManage {
    using SafeMath for uint256;

    mapping(Pool => bool) deployedPools;




    constructor() public {




    }



    function approvePool(address newPool) public{
        Pool np = Pool(newPool);
        deployedPools[np] = true;
    }

    function deployPool() public{
        //make this take paramaters and stuff to deploy a custom pool, then add it to approved pools
    }

    function depositToPool(address p, uint256 amount ) public{ //p stands for pool
        Pool pool = Pool(p); //cast address to pool
        require(deployedPools[pool]); //make sure pool is approved in out system

        IERC20 pToken = pool.getToken(); //get the contract of the pools staking token, and make it work like an erc20
        bool success = pToken.transferFrom(msg.sender, p, amount); //transfer tokens from the user to the pool
        require(success, "Failed to transfer token, needs approval"); //throw a fit if the transfer doesnt happen
        pool.deposit(msg.sender, amount); //have the pool deposit the tokens into the strategy
    }

    function withdrawFromPool(address p, uint256 amount) public{
        Pool pool = Pool(p); //cast address to pool
        require(deployedPools[pool]); //make sure pool is approved in out system

        pool.withdraw(msg.sender, amount);

    }



}
