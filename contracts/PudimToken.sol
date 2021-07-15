pragma solidity  >=0.4.22 <0.9.0;
contract PudimToken {
   // Informações sobre o token 
    string public name =  "Pudim Token";
    string public symbol =  "PDT"; 
    string public standard =  "PDT Token v1.0";     
    uint256 public totalSupply;

   // Evento de transferencia confirma quando uma transf for realizada;
    event Transfer(
        address indexed _from,
        address indexed  _to, 
        uint256 _value);

    // Evento que Aprova o usuário a Gastar tokens na função Approve
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    
    // Mapping que armazena a quantidade de tokens de uma conta 
    mapping(address => uint) public balanceOf;
    // Permite que uma conta permita diversas contas a gastar x tokens
    mapping(address => mapping(address => uint)) public allowance;

    // Construtor
    constructor(uint256 _initialSupply) public {
        //Atribui o Supply inicial a quem chamou essa função e diz que o supply total é o supply inicial
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
    //função de transferencia;
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Exige que a pessoa que chamou a função tenha tokens suficientes
        require(balanceOf[msg.sender] >= _value);
        // Subtrai o quanto foi enviado da conta da pessoa que chamou a função
        balanceOf[msg.sender] -= _value;
        // Incrementa o quanto foi enviado...
        balanceOf[_to] += _value;
        // Emite o evento de transferencia
        emit Transfer(msg.sender, _to, _value);
        //retorna verdadadeiro caso a função de transferencia tenha chegado ao fim;
        return true;
    }
    // Função que aprova uma determinado usuário a gastar tokens
    function approve(address _spender, uint256 _value) public returns (bool success){
        // Atribui o valor que foi permitido a pessoa que vai gastar
        allowance[msg.sender][_spender] = _value;
        // Emite o Evento de aprovação que diz que o Usuário que chamou a função, permitiu outro usuario x a gastar y tokens
        emit Approval(msg.sender,_spender, _value);
        // Retorna verdadeiro cas a função de approve tenha chegado ao fim;
        return true;
    }
    // Função transferir de
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){
        // Exige que a pessoa que trasnferirá tenha tokens suficientes
        require(_value <= balanceOf[_from]);
        // Exige que essa pessoa tabém tenha permissão pra fazer essa transferencia
        require(_value <= allowance[_from][msg.sender]);

        // Subtrai e incrementa os valores
        balanceOf[_from]-=  _value;
        balanceOf[_to]+= _value;

        // Permite que a pessoa que trasferirá subtraia esses tokens
        allowance[_from][msg.sender] -= _value;
        
        // Emite o evento de transferencia
        emit Transfer(_from, _to, _value);
        // retorna verdadeiro se a função tiver chegado ao fim;
        return true;
    }
}
