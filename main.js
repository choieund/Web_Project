const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")

var authRouter = require('./auth.js');
var authCheck = require('./authCheck.js');
var template = require('./template.js');

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

app.get('/main',(req,res)=>{
    if(!authCheck.isfalse(req,res)) {
        res.redirect('/auth/login');
        return false;
    } 
    var html = template.HTML('Welcome',
     `<hr>
        <h2>메인 페이지에 오신 것을 환영합니다</h2>
        <p>로그인에 성공하였습니다.</p>`,
    authCheck.statusUI(req,res)
    );
    res.send(html);
    
});


app.listen(app.get('port'),()=>{
    console.log(`listening on port ${port}`);
});