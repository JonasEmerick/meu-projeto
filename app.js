const http = require("http");
const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");


//Funcão de validação de e-mail no padrao xxxxx@xxxx.com
function validateEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//Middleware para ler JSON no corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Banco de dados:
/* const { Pool } = require("pg");

const pool = new Pool({
    user: "jonasemerick@icloud.com",
    host: "",
    database: "",
    password: "",
    port: 5432,
    ssl: true

}) */

const userList = [];

//Forma get de pegar login
//app.get('/login', function(req, res) {
    //const usuario = req.query.usuario;
    //const pass = req.query.pass;

//Forma post(mais segura) de pegar login
app.post("/login", async(req, res) => {
    const {email, pass} = req.body;

//Verificação de dados de login:

//se ambos estiverem preenchidos fazer um select para trazer o usuário do banco de dados

//Verificar se os dados abaixo estão vazios:
const login = userList.find(user => user.email === email);

    if(!login || !pass){
        return res.status(400).json({error: 'Login ou senha inválidos!'})
    }

    const criptoPass = await bcrypt.compare(pass, login.pass);

    if(login && criptoPass){
        return res.status(200).json({message: 'Login realizado com sucesso!'});

    }
        return res.status(400).json({error: 'Login ou senha inválidos!'});
});

app.post("/register", async(req, res) => {
    const {email, pass} = req.body;


// Verificação de dados de registro:

    if(!email || !pass){
        return res.status(400).json({error: 'É necessaŕio preencher todos os campos!'});

    }else if(pass.length < 6){
         return res.status(400).json({error: 'A pass não pode ter menos de 6 digitos!'});

    }else if(!validateEmail(email)){  
        return res.status(400).json({error: 'E-mail invalido!'});  

    }

    //Verificação se o usuário existe no banco de dados:
    const emailExistente = userList.find(user => user.email === email);
    if (emailExistente){
        return res.status(200).json({error: 'Usuário já cadastrado!'});
    }

    //Incluir usuário no banco de dados:
    const criptoPass = await bcrypt.hash(pass,10);
    userList.push({email, pass: criptoPass});
    return res.status(200).json({message: 'Cadastro realizado!'});

    

});

//Alterar pass
app.put('/register', async(req, res) => {
    const {email, pass} = req.body;
    const aUser = userList.filter(user => user.email);

    if(aUser.length){
email
        const criptoPass = await bcrypt.hash(pass,10);
        userList[aUser.length - 1].pass = criptoPass;
        return res.status(200).json({message: 'Alteração de senha realizada!'});

    }

})

app.get("/user", (req, res) => {
  return res.json(userList);
});

http.createServer(app).listen(port, () => console.log("Servidor rodando local na porta 3000"));
