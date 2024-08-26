const mysql = require('mysql2/promise');

// const connectionURI = process.env.DATABASE_URL || 'mysql://udqzg6ljljoeuryg:XrIvE3Xeu6nJ7PWH6pBS@bndpltkjf4wvkt2boe0j-mysql.services.clever-cloud.com:3306/bndpltkjf4wvkt2boe0j';

const mySqlPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


module.exports = mySqlPool;


