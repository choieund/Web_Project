const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")

var authRouter = require('./lib_login/auth');
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');

const app = express();

app.set('port', process.env.PORT || 3000);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', async(req, res)=> {
    if(!authCheck.isfalse(req, res)) {
        res.redirect('/auth/login');
        return false;
    } else {
        res.redirect('/main');
        return false;
    }
});


app.use('/auth',authRouter);
