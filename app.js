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
    const {email, pass, id} = req.body;

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
    const {email, pass, user_id} = req.body;


// Verificação de dados de registro:

    if(!email || !pass){
        return res.status(400).json({error: 'É necessaŕio preencher todos os campos!'});

    }else if(pass.length < 6){
         return res.status(400).json({error: 'A pass não pode ter menos de 6 digitos!'});

    }else if(!validateEmail(email)){  
        return res.status(400).json({error: 'E-mail invalido!'});  

    }

    //Verificação se o usuário existe no banco de dados:
    const userExist = userList.find(user => user.user_id === user_id && user.email === email);

    if (userExist){
        return res.status(200).json({error: 'Usuário já cadastrado!'});
    }

    //Incluir usuário no banco de dados:
    const criptoPass = await bcrypt.hash(pass,10);
    userList.push({user_id ,email, pass: criptoPass});
    return res.status(200).json({message: 'Cadastro realizado!'});

    

});

//Alterar pass
app.put("/register", async(req, res) => {
    const {email, pass, id} = req.body;
    const aUser = userList.findIndex(user => user.id === id);

    if(aUser){
        const criptoPass = await bcrypt.hash(pass,10);
        userList[aUser].pass = criptoPass;
        return res.status(200).json({message: 'Alteração de senha realizada!'});

    }

});

app.get("/user", function(req, res) {
  return res.json(userList);
});

//Banco de dados de Tasks

const taskList = [];

//Inclusão no banco da tasks

app.post("/user/:user_id/tasks/" , function(req , res) {
    const user_id = req.params.user_id;
    const {task_id, title, description, status} = req.body;
    const taskExist = taskList.find(tasks => tasks.task_id === task_id && tasks.user_id === user_id);
    if(!taskExist){
        if(!task_id || !title || !description || !status){
            return res.status(400).json({error: 'É necessário preencher todos os campos!'})


        }
            taskList.push({user_id ,task_id, title, description, status});
            return res.status(200).json({message: 'Task cadastrada!'});
    }
    res.status(400).json({error: 'ID já cadastrado!'})
});
//Alterar o Status da tasks
app.put("/user/:user_id/tasks/:task_id", function(req, res) {
    const {id, title, description, status} = req.body;
    const userId = req.params.user_id;
    const userIdExist = userList.firndIndex(user => user.id === userId)
    const aTaskList = taskList.findIndex(tasks => tasks.id === id);
    //Alterar o status da tasks:
    if(userIdExist){
    if(aTaskList){

        taskList[aTaskList].status = status;
        taskList[aTaskList].title = title;
        taskList[aTaskList].description = description;
        return res.status(200).json({message: 'Dados da tasks alterados!'});
    }
    return res.status(400).json({error: 'Task não encontrada!'});
    }
    return res.status(200).json({error: 'Id não localizado!'})

});

//Deletar uma tasks
app.delete("/user/:user_id/tasks/:task_id", function(req, res) {
    const {userId, taskId} = req.params;
    const aTaskList = taskList.findIndex(tasks => tasks.id === taskId);
    if(aTaskList){
        const deleteTask = taskList.splice(aTaskList, 1);
        return res.status(200).json({message: `A task com id  ${id} foi excluído!`});

    }
    return res.status(400).json({error: 'Task não encontrada!'});


});

//Pegar tasks
app.get("/user/:user_id/tasks/:task_id", function(req, res){
    const {user_id, task_id} = req.params;
    const taskIndex = taskList.findIndex(task => task.user_id === user_id && task.task_id === task_id);

    if(taskIndex>=0){
        return res.status(200).json ({message: taskList[taskIndex]});
    }
    return res.status(400).json({error: 'Task não localizada!'});

});


//Listar as tasks
app.get("/tasks", function (req, res) {
   return res.json (taskList);

});

app.get("")



http.createServer(app).listen(port, () => console.log("Servidor rodando local na porta 3000"));


