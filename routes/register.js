var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const validate = require("../functions/validation");
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const mailer = require('express-mailer');
var config = require('../config.js')
var port = config.port;
const getIP = require('external-ip')();
const iplocation = require("iplocation").default


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

//Get all Users
app.get('/register', (req, res) => {
    schema.user.find({}, function (err, data) {
        if (err) throw err;
    });
    if (app.locals.erreg == undefined)
        app.locals.erreg = 'Please fill in the form to register!';
    res.render('register', { erreg: app.locals.erreg });
});

//Adding User to DB!
app.post('/register', upload.single('photo'), urlencodedParser, async function (req, res) {
    //validate password
    if (validate.checkPassword(req.body.password)) {
        //hash password and vkey
        var password = req.body.password;
        var key = req.body.username + Date.now();
        const hashpw = crypto.createHash("sha256");
        const hashkey = crypto.createHash("sha256");
        hashpw.update(password);
        hashkey.update(key);
        vkey = hashkey.digest("hex");
        //checks if user exists and insert user data into db
        schema.user.findOne({ username: req.body.username }, function (err, data) {
            if (req.body.age >= 18) {
                if (err) throw err;
                if (data == null) {
                    //add new user to db
                    schema.user({
                        image: req.file.buffer.toString('base64'),
                        name: req.body.name,
                        surname: req.body.surname,
                        username: req.body.username,
                        password: hashpw.digest("hex"),
                        email: req.body.email,
                        age: req.body.age,
                        gender: req.body.gender,
                        sp: req.body.sp,
                        bio: req.body.bio,
                        sport: req.body.sport,
                        fitness: req.body.fitness,
                        technology: req.body.technology,
                        music: req.body.music,
                        gaming: req.body.gaming,
                        ageBetween: req.body.ageBetween,
                        vkey: vkey
                    }).save(function (err) {
                        if (err) throw err;
                        else {
                            getIP(function (err, ip) {
                                var geo = iplocation(ip, [], function (err, res) {
                                    if (err) throw err;
                                    //add new user to db
                                    if (err) throw err;

                                    if (res.city) {
                                        city = res.city;
                                    }
                                    if (res.country) {
                                        country = res.country;
                                    }
                                    if (res.postal) {
                                        postal = res.postal;
                                    }
                                    schema.user.findOneAndUpdate({ username: req.session.user },
                                        {
                                            $set: {
                                                city: city,
                                                country: country,
                                                postal: postal,
                                            }
                                        }, async function (err, data) {
                                            if (err) throw err;
                                        })
                                })
                            })
                            //send verification email to user
                            app.mailer.send('email', {
                                to: req.body.email,
                                subject: 'Matcha Registration',
                                vkey: vkey,
                                port: port
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                console.log('Registration email sent to ' + req.body.username);
                            })
                        }
                        console.log("Added user to DB!")
                    })
                    //set session variable and unset local error variable
                    req.session.user = req.body.username;
                    app.locals.erreg = undefined;
                    res.redirect('/');
                }
                else {
                    console.log("User Exists!");
                    app.locals.erreg = 'User Exists!';
                    res.redirect('/register');
                }
            }
            else {
                console.log('User needs to be 18 or older');
                app.locals.erreg = 'User must be 18 or older to register!';
                res.redirect('/register');
            }
        })
    }
    else {
        console.log("Password invalid!");
        app.locals.erreg = 'Password must be 6-20 characters with 1 capital and 1 number';
        res.redirect('/register');
    }
});

//verify user account
app.get('/verify',  urlencodedParser,(req, res) => {
    var key = req.query.vkey.toString();
    console.log(key);
    // check why error with { $ne: [vkey, 'null'] },                            <--------!!!!!!!
    schema.user.findOneAndUpdate({ vkey: key },
        {
            $set: {
                verified: true
            }
        }, function (err, data) {
            if (err) throw err;
            console.log(data.username + " Has been verified!");
        })
    res.render('verify');
});
module.exports = app;