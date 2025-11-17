const {getPool} = require('./connection')

async function listarTarefas() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM TASKS' )
    console.log(result.recordset)

} 

listarTarefas()

.then(() => console.log('Listagem concluída'))
.catch(error => console.log('Erro ao listar o DB', error));
