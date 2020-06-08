var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});

const port = 8014;

module.exports.port = port;
module.exports.connection = connection;
