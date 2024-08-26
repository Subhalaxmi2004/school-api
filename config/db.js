const mysql = require('mysql2/promise');
const mySqlPool  = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root123',
    database:'school_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
 module.exports = mySqlPool;
