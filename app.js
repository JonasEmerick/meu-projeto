const http = require("http");
const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");


//Funcão de validação de e-mail no padrao xxxxx@xxxx.com
function validarEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//Middleware para ler JSON no corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Banco de dados local na memória
const usuarios = [];

//Forma get de pegar login
//app.get('/login', function(req, res) {
    //const usuario = req.query.usuario;
    //const senha = req.query.senha;

//Forma post(mais segura) de pegar login
app.post("/login", async(req, res) => {
    const {usuario, senha} = req.body;

//Verificação de dados de login:
    const login = usuarios.find(dadoArmazenado => dadoArmazenado.usuario === usuario)
    if(!login){
        return res.status(200).json({mensagem: 'Login ou senha inválidos!'});

    }
    const senhaCriptografada = await bcrypt.compare(senha, login.senha);
    if (!senhaCriptografada){
        return res.status(400).json({erro: 'Login ou senha inválidos!'});
    }
    
    return res.status(200).json({mensagem: 'Login realizado com sucesso!'});
});

app.post("/registrar", async(req, res) => {
    const {usuario, senha} = req.body;


// Verificação de dados de registro:

    if(!usuario || !senha){
        return res.status(400).json({erro: 'É necessaŕio preencher todos os campos!'});
    }else if(senha.length < 6){
         return res.status(400).json({erro: 'A senha não pode ter menos de 6 digitos!'});
    }else if(!validarEmail(usuario)){  
        return res.status(400).json({erro: 'E-mail invalido!'});  

    }

    //Verificação se o usuário existe no banco de dados:
    const existente = usuarios.find(dadoArmazenado => dadoArmazenado.usuario === usuario);
    if (existente){
        return res.status(400).json({erro: 'Usuário já cadastrado!'})
    }

    //Incluir usuário no banco de dados:
    const senhaCriptografada = await bcrypt.hash(senha,10);
    usuarios.push({usuario, senha: senhaCriptografada});
    return res.status(200).json({mensagem: 'Cadastro realizado!'});

    

});

app.get("/usuarios", (req, res) => {
  return res.json(usuarios);
});

http.createServer(app).listen(port, () => console.log("Servidor rodando local na porta 3000"));
