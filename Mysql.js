var meysql = require('mysql');
var db = meysql.createConnection({
    host: 'localhost',
    user: 'eunhee',
    password: 'rnfl!04190803',
    database: 'project'
});
db.connect();

module.exports = db;