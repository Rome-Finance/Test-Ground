// SPDX-License-Identifier: MIT


/*
Yearn's strategy interface, modified
*/

pragma solidity ^0.7.5;

interface IStrategy {

    function deposit(uint256) external;

    // Controller | Vault role - withdraw should always return to Vault
    function withdraw(uint256) external;

    // Controller | Vault role - withdraw should always return to Vault
    function withdrawAll() external returns (uint256);

    //returns total balance of all funds in the strategy in some number forms that corresponds to the underlying strategy
    //should have the users balance in strategy be proportional to their ownership of the pool's liquidity
    function totalBalance() external view returns (uint256);
}