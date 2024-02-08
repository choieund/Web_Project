var express = require("express");
var router = express.Router();

var template = require('./tamplate.js');
var db = require('./Mysql.js');
const e = require("express");

router.get('/login', function(request, response){
    var title = '로그인';
    var html = template.HTML(title,
        `<h2>로그인</h2>
        <form action="/auth/login_process" method="post">
        <p><input class="login" type="text" name="username" placeholder="아이디"></p>
        <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>
        <p><input class="button" type="submit" value="로그인"></p>
        </form>
        <p>계정이 없으신가요? <a herf="/auth/register">회원가입</a></p>`,'');
    response.send(html);
});

router.post('/login_process', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username && password) {
        db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [username, password], function(err, result, fields) {
            if(err) throw err;
            if(result.length > 0) {
                req.session.is_logined = true;
                req.session.nickname = username;
                res.session.save(function() {
                    res.redirect('/');
                });
            } else {
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다.");
                document.location.href="/auth/login";</script>`);
            }
        });
    } else {
        res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요.")
        document.location.href="/auth/login";</script>`);
    }
});

router.get('/logout', function(req, res){
    req.session.destroy(function(err){
        res.redirect('/');
    });
});


router.get('/register', function(req,res) {
    var title="회원가입";
    var html = template.HTML(title,`
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호></p>
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="button" type="submit" value="제출"></p>
    </form>
    <p><a herf="/auth/login">로그인화면으로 돌아가기</a></p>`, '');
    res.send(html);
});


router.post('/register_process', function(req,res){
    var uesrname = req.body.username;
    var password = req.body.pwd;
    var password2 = req.body.pwd2;

    if(username && password && password2) {
        db.query('SELECT * FROM usertable WHERE username = ?', [username], function(err, results, fields) {
            if(err) throw err;
            if(results.length <= 0 && password == passwrod2){
                db.query('INSERT INTO usertable(username, password) VALUES(?,?)', [username, password], function(err,data){
                    if(err) throw err2;
                    res.end(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다.");
                    document.location.href="/auth/register";</script>`);
                });
            } else if(password != password2){
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다.");
                document.loaction.href="/auth/register";</script>`);
            } else {
                res.send(`<script type="text/javascript">alert("이미 존재하는 아이디입니다.");
                document.location.href="/auth/register";</script>`);
            }
        });
    } else {
        res.send(`<script type="text/javascript>alert("입력되지 않은 정보가 있습니다.");
        document.location.href="/auth/register";</script>`);
    }
});

module.exports = router;