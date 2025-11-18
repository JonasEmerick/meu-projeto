const http = require("http");
const express = require("express");
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
const {getPool} = require('./connection')



//Middleware para ler JSON no corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Realizar consultas no SQL

async function execSQLQuery(sqlQry) {
    const pool = await getPool();
    const { recordset } = await pool.request().query(sqlQry);
    return recordset;
}


/* app.put('/register/:user_id', (req, res)=>{
    const id = req.params.user_id;
})
 */


//Consultar todos os logins

app.get('/login', async (req, res) => {
    const aUsers = await execSQLQuery('SELECT * FROM users');
    
    if (!aUsers.length) {
        res.status(400).json({ error: 'Não existe usuários' });
    }
    
    return res.status(200).json(aUsers);
});

//Adicionando um novo login

app.post('/register', async (req, res) => {
    const { email, pass } = req.body;

    if (!email && !pass) {
        return res.status(400).json({ error: 'É necessário preencher todos os campos!' });
    }

    const loginExist = await execSQLQuery('SELECT * FROM users WHERE email=' + email);

    if (loginExist) {
        return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    await execSQLQuery(`INSERT INTO users(email, pass) VALUES('${email}','${pass}')`)
    res.status(200).json({ message: 'Dados de login inseridos!' });
});


//Consultar login para acesso

app.get('/login/:id', async (req, res)=>{
    const id = req.params.id;
    const {email, pass} = req.body;
    if(!id){
        return res.status(400).json({error: 'ID não informado.'});
    }
    const idExist = await execSQLQuery('SELECT * FROM users WHERE id='+id);
    if(!idExist.length){
        return res.status(400).json({error: 'ID não existe'});
    }
    const userExist = await execSQLQuery(`SELECT * FROM user WHERE id=${id} AND email=${email} AND pass=${pass}`);
    if(!userExist.length){
        return res.status(400).json({error:'Login ou senha inválidos!'})
    }
    return res.status(200).json({message: 'Login realizado!'});
});

//Trocar de senha de login

app.put('/login/:id', async (req, res)=>{
   const id = req.params;
   const {email, newPass} = req.body;
   if(!id){
    return res.status(400).json({error: 'Id não informado.'});
   }
   const idExist = await execSQLQuery(`SELECT * FROM users WHERE id=${id}`);
   if(!idExist.length){
    return res.status(400).json({error: 'Id não encontrado!'});
   }
   const userExist = await execSQLQuery(`SELECT * FROM users WHERE id=${id} AND email=${email}`);
   if(!userExist.length){
    return res.status(400).json({error: 'Email não encontrado!'})
   }
   await execSQLQuery(`UPDATE users SET pass= ${newPass} WHERE id=${id}`);
   return res.status(200).json({message: 'Senha atualizada!'});
});


//Consultar tasks do Usuario
app.get('/tasks', async(req, res) => {
    const {user_id} = req.query;
    const aTasks = await execSQLQuery(`SELECT * FROM tasks WHERE user_id=${user_id}`);
    if(!aTasks){
        return res.status(400).json({error:'Id sem tasks!'});
    }
    return res.status(200).json(aTasks);
    
});

/* //"id": 1,
    "user_id": 1,
    "name": "Criar layout da página inicial",
    "priority": "Alta",
    "status": "Pendente",
    "created_at": "2025-11-14T03:10:53.555Z",
    "completed_at": null */

app.post('/tasks', async(req, res) => {
    const {user_id,name, priority, status, created_at, completed_at}= req.body;

    if (!user_id){
        return res.status(400).json({error: 'Id user não informado!'})
    }
    await execSQLQuery(`INSERT INTO tasks(user_id, name, priority, status, created_at, completed_at) VALUES (${user_id},'${name}',
        '${priority}', '${status}', '${created_at}', '${completed_at}')`);
    res.status(200).json({message:'Tasks incluida com sucesso'});
    


});

//Alterar dados da task

app.put('/tasks/:id', async(req, res)=>{
    const taskId = req.params.id;
    if(!taskId){
        return res.status(400).json({error: 'Id não informado!'})
    }
    const {user_id, name, priority, status, created_at, completed_at} = req.body;
    const taskExist = await execSQLQuery(`SELECT * FROM [tasks] WHERE user_id=${user_id} AND id=${taskId}`);
    console.log(`SELECT * FROM [tasks] WHERE user_id=${user_id} AND id=${taskId}`)
    if(!taskExist.length){
        return res.status(400).json({error:'Task não encontrada!'});
    }
    await execSQLQuery(`UPDATE [tasks] SET name='${name}', priority='${priority}', 
        status='${status}', created_at='${created_at}', completed_at='${completed_at}' WHERE id=${taskId} AND user_id=${user_id}`);   
    
    return res.status(200).json({message: 'Dados atualizados!'});
});


//Deletar Tasks

app.delete('/tasks/:id', async(req, res)=>{
    const taskId = req.params.id;
    if(!taskId){
        return res.status(400).json({error: 'Id não inserido'});
    }
    const user_id = req.body.user_id;
    await execSQLQuery(`DELETE [tasks] WHERE user_id=${user_id} AND id=${taskId}`);
    return res.status(200).json({response: 'Task deletada!'});
})



http.createServer(app).listen(port, () => console.log("Servidor rodando local na porta 3000"));
