var express = require("express");
var router = express.Router();

var template = require('./tamplate.js');
var db = require('./Mysql.js');

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


