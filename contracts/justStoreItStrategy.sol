import "./IStrategy.sol";
import "./Pool.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.1-solc-0.7/contracts/token/ERC20/IERC20.sol";


contract justStoreItStrategy is IStrategy{

    IERC20 Coin;
    Pool MyPool;

    constructor(address coin, address pool) {
        Coin = IERC20(coin);
        MyPool = Pool(pool);
    }









    function deposit(uint256 amount) external override{

    }

    // Controller | Vault role - withdraw should always return to Vault
    function withdraw(uint256 amount) external override{
        require(msg.sender == address(MyPool));
        Coin.transfer(address(MyPool),  amount);
    }

    // Controller | Vault role - withdraw should always return to Vault
    function withdrawAll() external override returns (uint256){
        require(msg.sender == address(MyPool));
        Coin.transfer(address(MyPool),  Coin.balanceOf(address(this)));
    }

    //returns total balance of all funds in the strategy in some number forms that corresponds to the underlying strategy
    //should have the users balance in strategy be proportional to their ownership of the pool's liquidity
    function totalBalance() external view override returns (uint256){
        return Coin.balanceOf(address(this));
    }

}


