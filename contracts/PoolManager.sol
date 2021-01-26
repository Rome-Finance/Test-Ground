pragma solidity =0.7.5;


import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./openzeppelin-contracts/contracts/access/Ownable.sol";
import "./Pool.sol";

contract PoolManager is Ownable{
    using SafeMath for uint256;

    mapping(Pool => bool) approvedPools;
    address regionOwner;
    string regionName;
    event Test(bytes32 message);




    constructor(address regOwn, string memory regName) public {
        regionName = regName;
        regionOwner = regOwn;
    }


    /*
    should be safe for people because nobody has to invest into new pool we launch without looking at it
    does not give us ability to modify or fuck with existing pools in any way, just add new ones

    only region owner can add pools
    */
    function approvePool(address newPool) external{
        emit Test(".5");
        require(msg.sender == regionOwner);
        Pool np = Pool(newPool);
        approvedPools[np] = true;
    }

    /*
    @todo think about how this works, with modular yield/vault deployment for regions
    */
    //function deployPool() external{
    //    //make this take paramaters and stuff to deploy a custom pool, then add it to approved pools
    //}

    function depositToPool(address p, uint256 amount ) external{ //p stands for pool

        Pool pool = Pool(p); //cast address to pool
        require(approvedPools[pool], "pool not approved"); //make sure pool is approved in out system



        IERC20 pToken = pool.getToken(); //get the contract of the pools staking token, and make it work like an erc20
        bool success = pToken.transferFrom(msg.sender, p, amount); //transfer tokens from the user to the pool
        require(success, "Failed to transfer token, needs approval"); //throw a fit if the transfer doesnt happen
        pool.deposit(msg.sender, amount); //have the pool deposit the tokens into the strategy
    }

    function withdrawFromPool(address p, uint256 amount) external{
        Pool pool = Pool(p); //cast address to pool
        require(approvedPools[pool]); //make sure pool is approved in out system

        pool.withdraw(msg.sender, amount);

    }


    function getRegionOwner() public view returns(address){
        return regionOwner;
    }

    function getRegionName() external view returns(string memory){
        return regionName;
    }

    function isPoolApproved(address p) external view returns(bool){
        return approvedPools[Pool(p)];
    }

    //region owner can transfer ownership to new owner
    //this effectively means pool manager contract is defacto thing that represents a region. Could change that later and have region contract
    //if so change this
    function transferRegionOwner(address newOwner) external{
        require(msg.sender == regionOwner);
        regionOwner = newOwner;
    }




}
