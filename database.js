const pool = require('pg').Pool;
require('dotenv').config();


    const conn = new pool({
    user: process.env.USER, 
    host : process.env.HOST, 
    database : 'private_thoughts_api',
    password: process.env.DBPASS, 
    port: 5432
    });

module.exports = conn;