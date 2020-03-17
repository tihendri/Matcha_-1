var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    if (app.locals.errlog == undefined)
        app.locals.errlog = 'Please fill in the form to login!';
    res.render('login', { err: app.locals.errlog });
});

app.post('/',urlencodedParser,(req,res) => {
    const hash= crypto.createHash("sha256");
        hash.update(req.body.enter_password);
    schema.user.findOne({username: req.body.enter_username}, async function(err, data){
        if (data){
            if(data.verified == true){
                if (data.username == req.body.enter_username) {
                    pass = hash.digest("hex");
                    console.log(pass);
                    if (data.password == pass){
                        console.log("logged in");
                        req.session.user = req.body.enter_username;
                        app.locals.errlog = undefined;
                        schema.user.findOneAndUpdate({username: req.session.user},
                            {$set:{status:"online"}}, async function(err, data){
                                if(err) throw err;
                            })
                        res.redirect('home');
                    }
                    else{
                        app.locals.errlog = 'password incorrect';
                        res.redirect('/');
                    }
                }
            }
            else{
                app.locals.errlog = 'your account has not been verified. please check your email!';
                res.redirect('/');
            }
        }
        else{
            app.locals.errlog = 'username does not exist';
            res.redirect('/');
        }
    });
})

module.exports = app;