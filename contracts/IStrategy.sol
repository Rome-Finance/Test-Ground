// SPDX-License-Identifier: MIT


/*
Yearn's strategy interface
*/

pragma solidity ^0.7.5;

interface IStrategy {
    function want() external view returns (address);

    function deposit(uint256) external;

    // NOTE: must exclude any tokens used in the yield
    // Controller role - withdraw should return to Controller
    function withdraw(address) external;

    // Controller | Vault role - withdraw should always return to Vault
    function withdraw(uint256) external;

    function skim() external;

    // Controller | Vault role - withdraw should always return to Vault
    function withdrawAll() external returns (uint256);

    function balanceOf() external view returns (uint256);
}