var express = require("express");
var router = express.Router();

var template = require('./template.js');
var db = require('../Mysql.js');
const e = require("express");

router.get('/login', function(req, res){
    var title = '로그인';
    var html = template.HTML(title,
        `<h2>로그인</h2>
        <form action="/auth/login_process" method="post">
        <p><input class="login" type="text" name="username" placeholder="아이디"></p>
        <p><input class="login" type="password" name="password" placeholder="비밀번호"></p>
        <p><input class="button" type="submit" value="로그인"></p>
        </form>
        <p>계정이 없으신가요? <a href="/auth/register">회원가입</a></p>`,'');
    res.send(html);
});

router.post('/login_process', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username && password) {
        db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [username, password], function(error, result, fields) {
            if(error) throw error;
            if(result.length > 0) {
                req.session.is_logined = true;
                req.session.nickname = username;
                req.session.save(function() {
                    res.redirect(`/`);
                });
            } else {
                res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다.");
                history.back();</script>`);
            }
        });
    } else {
        res.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요.")
        history.back();</script>`);
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
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="button" type="submit" value="제출"></p>
    </form>
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>`, '');
    res.send(html);
});


router.post('/register_process', function(req,res){
    var username = req.body.username;
    var password = req.body.pwd;
    var password2 = req.body.pwd2;

    if(username && password && password2) {
        db.query('SELECT * FROM usertable WHERE username = ?', [username], function(error, results, fields) {
            if(error) throw error;
            if(results.length <= 0 && password == password2){
                db.query('INSERT INTO usertable(username, password) VALUES(?,?)', [username, password], function(error,data){
                    if(error) throw error2;
                    res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다.");
                    document.location.href="/auth/login";</script>`);
                });
            } else if(password != password2){
                res.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다.");
                history.back();</script>`);
            } else {
                res.send(`<script type="text/javascript">alert("이미 존재하는 아이디입니다.");
                history.back();</script>`);
            }
        });
    } else {
        res.send(`<script type="text/javascript>alert("입력되지 않은 정보가 있습니다.");
        document.location.href="/auth/register";</script>`);
    }
});

module.exports = router;