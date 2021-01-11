pragma solidity =0.7.5;


import "./openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "./openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./openzeppelin-contracts/contracts/access/Ownable.sol";
import "./PoolManager.sol";
import "./IStrategy.sol";
import "./Pool.sol";

contract StrategyControler is Ownable{
    using SafeMath for uint256;

    address PoolManager;

    mapping(Pool => IStrategy) nextStrategies;
    mapping(Pool => uint256) nextStrategyUnlockTimes;

    uint256 timeToLock;

    constructor(uint256 time) public {
        timeToLock = time;
    }


    function startTimelock(address poolToChange, address nStrategy) external onlyOwner{
        Pool sPool = Pool(poolToChange); //cast
        IStrategy nextStrategy = IStrategy(nStrategy); //cast
        nextStrategies[sPool] = nextStrategy; //set the strategy that can be deployed after timelock
        nextStrategyUnlockTimes[sPool] = block.timestamp.add(timeToLock); //add 1 day of seconds onto the current time to allow unlock in 1 day
    }

    function deployAfterTimelock(address poolToChange) external onlyOwner{
        Pool sPool = Pool(poolToChange); //cast
        require(nextStrategyUnlockTimes[sPool] < block.timestamp, "timelock has not expired"); // require that 24 hours have passed since calling start time lock
        sPool.setStrategy(nextStrategies[sPool]); // call the setStrategy method of the pool, replaces strategy pool uses. Causes unstake and stake of pool to do different stuff

    }




}