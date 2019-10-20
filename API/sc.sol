pragma solidity ^0.4.23;

contract BaseERC20Token {
    mapping (address => uint256) public balanceOf;

    string public name;								 // optional
    string public symbol;							 // optional
    uint256 public totalSupply;
    address public owner = msg.sender;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor (
        uint256 _totalSupply,
        string _name,								 // optional
        string _symbol								 // optional
    )
        public
    {
        name = _name;								 //optional
        symbol = _symbol;							 // optional
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value);
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => mapping(address => uint256)) public allowance;

    function approve(address spender, uint256 value) public returns (bool success)
    {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success)
    {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
    
    function mint(address recipient, uint256 amount) public {
        require(msg.sender == owner);
        require(totalSupply + amount >= totalSupply); // Overflow check
        totalSupply += amount;
        balanceOf[recipient] += amount;
        emit Transfer(address(0), recipient, amount);
    }
    function getBalanceOf(address account) public view returns (uint256) {
        return balanceOf[account];
    }
}