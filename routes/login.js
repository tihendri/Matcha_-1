var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const bodyParser = require('body-parser');
var config = require('../config.js')
const connection = config.connection;

const urlencodedParser = bodyParser.urlencoded({ extended: false })

var loginUsername;
var loginPassword
app.get('/', (req, res) => {
    if (app.locals.errlog == undefined)
        app.locals.errlog = 'Please fill in the form to login!';
    res.render('login', { err: app.locals.errlog });
});
//Connect to DB mysql

app.post('/', urlencodedParser, (req, res) => {
    const hash = crypto.createHash("sha256");
    hash.update(req.body.enter_password);
    const username = req.body.enter_username.charAt(0).toUpperCase() + req.body.enter_username.substring(1);
    loginUsername = username;
    req.session.user = username;
    loginPassword = hash.digest("hex");
    res.redirect("/loginUser")
    // schema.user.findOne({username: username}, async function(err, data){
    // if (data){
    // if (data.verified == true) {
    //     if (data.username == username) {
    //         pass = hash.digest("hex");
    //         console.log(pass);
    //         if (data.password == pass) {
    //             console.log("logged in");
    //             req.session.user = username;
    //             app.locals.errlog = undefined;
    //             schema.user.findOneAndUpdate({ username: req.session.user },
    //                 { $set: { status: "online" } }, function (err, data) {
    //                     if (err) throw err;
    //                 })
    //             res.redirect('home');
    //         }
    //         else {
    //             app.locals.errlog = 'password incorrect';
    //             res.redirect('/');
    //         }
    //     }
    // }
    // else {
    //     app.locals.errlog = 'your account has not been verified. please check your email!';
    //     res.redirect('/');
    // }
}
    // else{
    //     app.locals.errlog = 'username does not exist';
    //     res.redirect('/');
    // }
);
app.get("/loginUser", async (req, res) => {
    let online = "online";
    var password;
    var verified;
    let loginSql = "SELECT * FROM users WHERE username = ?";
    let updateStatus = `UPDATE users SET status = '${online}' WHERE username = '${loginUsername}'`;
    connection.query(loginSql, loginUsername, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {
            verified = result.verified;
            password = result.password;

        })
        console.log(verified);
        if (verified == true) {
            if (password == loginPassword) {
                connection.query(updateStatus, async (err, result) => {
                    if (err) throw err;
                    console.log("Updated status")
                });
                res.redirect('home');
            } else {
                app.locals.errlog = 'password incorrect';
                res.redirect('/');
            }
        } else {
            app.locals.errlog = 'your account has not been verified. please check your email!';
            res.redirect('/');
        }
    });
}
)

module.exports = app;