var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const mailer = require('express-mailer');
var config = require('../config.js')
var port = config.port;

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
    schema.user.findOneAndUpdate({ email: req.body.enter_email }, { $set: { vkey: vkey } }, function (err, data) {
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
            console.log('Email sent to change ' + data.username + '\'s password');
            if (app.locals.erreg == undefined)
                app.locals.erreg = 'Please check your email!';
            res.redirect('/');
        })
    })
});

app.get('/changepass', urlencodedParser, (req, res) => {
    const key = req.query.vkey.toString();
    console.log(key);
    res.render('change-pass', { vkey: key });
});

app.post('/changepass', urlencodedParser, (req, res) => {
    var key = req.body.vkey;
    console.log(key)
    var pass = req.body.new_password;
    const hashkey = crypto.createHash("sha256");
    hashkey.update(pass);
    schema.user.findOneAndUpdate({ vkey: key },
        {
            $set: {
                password: hashkey.digest("hex")
            }
        }, function (err, data) {
            if (err) throw err;
            console.log(data.username + "'s password has been updated!");
        })
    res.redirect('/');
});

module.exports = app;