const sql = require("mssql");
const dotenv = require("dotenv");


dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database : process.env.DB_NAME,
    port: process.env.DP_PORT,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
}

async function getPool(){
    try{
        const pool = await sql.connect(config);
        return pool;

    }catch(error){
        console.log("Erro de conexão DB", error);
    }
}

module.exports = { getPool, sql};
