pragma solidity >=0.4.17;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/access/Ownable.sol";
import "Rome.sol";

contract Citizenship is ERC721, Ownable {
    using SafeMath for uint256;

    uint256 public citizenCount;
    address public RomeContract = 0xaE036c65C649172b43ef7156b009c6221B596B8b;
    Rome public roma;

    constructor () ERC721("RomanCitizenship", "RCIT") public {
        roma = Rome(RomeContract);
        citizenCount = 0;
    }

    /*
    Function that lets people pay .5 eth to buy a citizenship token,
    which is a nft erc721 token that makes them a member of the roman empire
    */

    function redeemCitizenship() public {
        require(roma.balanceOf(msg.sender) >= 20, "You dont have enough Rome tokens to become a citizen");
        require(balanceOf(msg.sender)==0, "This address is already a Roman citizen");
        _safeMint(msg.sender, citizenCount);
        citizenCount++;
    }

    function test() public view returns(uint){
        uint256 bal = roma.balanceOf(msg.sender);
        return bal;
    }






}