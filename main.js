const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")(session)

var authRouter = require('./lib_login/auth.js');
var authCheck = require('./lib_login/authCheck.js');
var template = require('./lib_login/template.js');

const app = express();

app.set('port', process.env.PORT || 3000);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        store: new FileStore(),
        cookie: {secure: true},
    })
)



app.get('/', (req, res) => {
    if(!authCheck.islogined(req, res)) {
        res.redirect('/auth/login');
        return false;
    } else {
        res.redirect('/main');
    }
});


app.use('/auth',authRouter);

app.get('/main',(req,res)=>{
    if(!authCheck.islogined(req,res)) {
        res.redirect('/auth/login');
        return false;
    } else {
        var html = template.HTML('Welcome',
         `<hr>
           <h2>메인 페이지에 오신 것을 환영합니다.</h2>
           <p>로그인에 성공하였습니다.</p>`, authCheck.statusUI(req, res));
        res.send(html);
    }
    
   
});


app.listen(app.get('port'), () => {
    console.log(`포트 ${app.get('port')}에서 서버가 동작 중입니다.`);
});
