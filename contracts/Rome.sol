pragma solidity =0.7.5;


import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";



contract Rome is ERC20 {
    using SafeMath for uint256;


    struct User{
        //the last block that the user burned rome to prepare to cash out
        uint256 lastBlock;
        //ether a user has burned rome tokens to gain, but has not yet claimed from the contract
        uint256 redeemedEther;
    }

    //stores all the info of users in order to cash out
     mapping(address => User) users;

    // .1 eth
    uint256 romePrice = 100000000000000000;

    constructor() ERC20("Rome", "ROME") public {

    }


    function buyRome(uint256 amount) public payable{
        uint256 cost = amount * romePrice; //each rome token costs .1 eth
        require(msg.value == cost, "Sent ether does not match buy price for the requested token amount");
        _mint(msg.sender, amount);
    }

    //
    function prepareUnstake(uint256 romeToBurn) public{
        // make sure the sender actually at least as much rome as they want to burn
        require(balanceOf(msg.sender) >= romeToBurn);
        //destroy the rome tokens
        _burn(msg.sender, romeToBurn);
        //set the data in the user struct so they can take out the eth during another block after this one.
        //this helps guard against flashloan attacks
        users[msg.sender].lastBlock = block.number;
        users[msg.sender].redeemedEther += romeToBurn * romePrice;
    }

    //must be executed at least one block later than prepareCashOut
    function unstake(uint256 etherToTakeOut) public{
        //must have enough eth ready to cash out for argument passed in
        require(users[msg.sender].redeemedEther >= etherToTakeOut, "trying to withdraw more eth than you have prepared to cash out");
        //must have passed one block at least since burning rome to convert to eth
        require(users[msg.sender].lastBlock < block.number, "you must wait at least 1 block before cashing out. Sorry for the inconvenience, this is to guard against flash loans");
        //subtract the ether this user has requested to take out of the contract from their allowance to take out of the contract
        //always subtract balance before transfering money, reentrancy attacks
        users[msg.sender].redeemedEther -= etherToTakeOut;
        //send em their eth!
        msg.sender.transfer(etherToTakeOut);
    }

    function mint(uint256 amount) public{
        _mint(msg.sender, amount);
    }


}
