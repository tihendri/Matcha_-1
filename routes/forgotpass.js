var express = require('express');
var app = express();
const crypto = require('crypto');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const mailer = require('express-mailer');
var config = require('../config.js')
const connection = config.connection;
var port = config.port;
const validate = require("../functions/validation");

mailer.extend(app, {
    from: 'matchaprojectsup@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'matchaprojectsup@gmail.com',
        pass: 'Matcha123'
    }
})

app.get('/forgotpass', (req, res) => {
    res.render('forgot-pass')
});

app.post('/forgotpass', urlencodedParser, (req, res) => {
    var key = req.body.enter_email + Date.now();
    const hashkey = crypto.createHash("sha256");
    hashkey.update(key);
    vkey = hashkey.digest("hex");
    let updatePassword = `UPDATE users SET vkey = '${vkey}' WHERE email = '${req.body.enter_email}'`;
    connection.query(updatePassword, async (err, result) => {
        if (err) throw err;
        //send verification email to user
        app.mailer.send('forgotpass-email', {
            to: req.body.enter_email,
            subject: 'Matcha Change Password',
            vkey: vkey,
            port: port
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Email sent to change password');
                app.locals.erreg = 'Please check your email!';
            res.redirect('/');
        })
    })
});

app.get('/changepass', urlencodedParser, (req, res) => {
    app.locals.erreg = "Please Enter Your New Password!"
    const key = req.query.vkey.toString();
    res.render('change-pass', { vkey: key, erreg: app.locals.erreg });
});

app.post('/changepass', urlencodedParser, (req, res) => {

    var key = req.body.vkey;
    var pass = req.body.new_password;
    if (validate.checkPassword(req.body.new_password )== true) {
        const hashkey = crypto.createHash("sha256");
        hashkey.update(pass);
        let updatePassword = `UPDATE users SET password = '${hashkey.digest("hex")}' WHERE vkey = '${key}'`;
        connection.query(updatePassword, async (err, result) => {
            if (err) throw err;
            console.log("password has been updated!");
            app.locals.erreg = "Password has been updated!"
            res.redirect('/');
        });

    } else {
        console.log('Password invalid');
        app.locals.erreg = 'Password must contain a Capital letter ,Lowercase letter, a number and be longer than 5 characters !'
        res.render('change-pass', { vkey: key, erreg: app.locals.erreg });
    }
})

module.exports = app;