var express = require('express');
var app = express();
const crypto = require('crypto');
const bodyParser = require('body-parser');
var config = require('../config.js')
const connection = config.connection;

const urlencodedParser = bodyParser.urlencoded({ extended: false })

var loginUsername;
var loginPassword
app.get('/', (req, res) => {
   
        app.locals.errlog = 'Please fill in the form to login!';
    res.render('login', { err: app.locals.errlog });
});
//Connect to DB mysql

app.post('/', urlencodedParser, (req, res) => {
    const hash = crypto.createHash("sha256");
    hash.update(req.body.enter_password);
    const username = req.body.enter_username.charAt(0).toUpperCase() + req.body.enter_username.substring(1).toLowerCase();
    console.log(username);
    loginUsername = username;
    req.session.user = username;
    loginPassword = hash.digest("hex");
    res.redirect("/loginUser")
}
);
app.get("/loginUser", async (req, res) => {
    app.locals.errlog = 'Please fill in the form to login!';
    let online = "online";
    var password;
    var verified;
    var username;
    let loginSql = "SELECT * FROM users WHERE username = ?";
    let updateStatus = `UPDATE users SET status = '${online}' WHERE username = '${loginUsername}'`;
    connection.query(loginSql, loginUsername, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {
            verified = result.verified;
            password = result.password;
            username = result.username;

        })
        console.log(verified);
        if (username == loginUsername) {
            if (verified == true) {
                if (password == loginPassword) {
                    connection.query(updateStatus, async (err, result) => {
                        if (err) throw err;
                        console.log("Updated status")
                    });
                    res.redirect('home');
                } else {
                    app.locals.errlog = 'This password is incorrect';
                    res.redirect('/');
                }
            } else {
                app.locals.errlog = 'This account has not been verified. Please check your email!';
                res.redirect('/');
            }
        } else {
            app.locals.errlog = 'This username does not Exist!';
            res.redirect('/');
        }
    });
}
)

module.exports = app;