const mysql = require('mysql2');

const pool = mysql.createPool({
   host: 'localhost',
   user: 'root',
   database: 'node-eshop',
   password: 'mysql'
});

module.exports = pool.promise();