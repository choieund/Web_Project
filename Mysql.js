var meysql = require('mysql');
var db = meysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rornfl!04190803',
    database: 'project'
});
db.connect();

module.exports = db;