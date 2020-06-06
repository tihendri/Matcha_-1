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
const iplocation = require("iplocation").default;
var mysql = require('mysql');

var image, name, surname, username, hexPassword, email, age, gender, sp, bio, sport, fitness, technology, music, gaming, ageBetween, vkey, city, country, postal;
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
//Connect to DB mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});

//Get all Users
app.get('/register', (req, res) => {

    if (app.locals.erreg == undefined)
        app.locals.erreg = 'Please fill in the form to register!';
    res.render('register', { erreg: app.locals.erreg });
});

//Adding User to DB!
app.post('/register', upload.single('photo'), urlencodedParser, async function (req, res) {
    //validate password
    //  if (validate.checkPassword(req.body.password)) {
    //hash password and vkey
    username = req.body.username.charAt(0).toUpperCase() + req.body.username.substring(1);
    var password = req.body.password;
    var key = req.body.username + Date.now();
    const hashpw = crypto.createHash("sha256");
    const hashkey = crypto.createHash("sha256");
    hashpw.update(password);
    hashkey.update(key);
    password = hashpw.digest("hex"),
        vkey = hashkey.digest("hex");
    await getIP(function (err, ip) {
        var geo = iplocation(ip, [], function (err, res) {
            if (err) throw err;
            //add new user to db
            if (err) throw err;

            if (res.city) {
                app.locals.city = res.city;
            }
            if (res.country) {
                app.locals.country = res.country;
            }
            if (res.postal) {
                app.locals.postal = res.postal;
            }
        })
    })


    if (req.body.age >= 18) {
  
        image = req.file.buffer.toString('base64'),
            name = req.body.name,
            surname = req.body.surname,
            username = username,
            hexPassword = password,
            email = req.body.email,
            age = req.body.age,
            gender = req.body.gender,
            sp = req.body.sp,
            bio = req.body.bio,
            sport = (req.body.sport == "on") ? "on" : "off",
            fitness = (req.body.fitness == "on") ? "on" : "off",
            technology = (req.body.technology == "on") ? "on" : "off",
            music = (req.body.music == "on") ? "on" : "off",
            gaming = (req.body.gaming == "on") ? "on" : "off",
            ageBetween = req.body.ageBetween,
            vkey = vkey,
            city = app.locals.city,
            country = app.locals.country,
            postal = app.locals.postal
        console.log("Postal code = " + app.locals.postal)
        res.redirect('/UserAdded');
        //set session variable and unset local error variable
        req.session.user = username;
        app.locals.erreg = undefined;
    }
    //
    // }
    else {
        console.log('User needs to be 18 or older');
        app.locals.erreg = 'User must be 18 or older to register!';
        res.redirect('/register');
        // }
        // })
        // }
        // else {
        //     console.log("Password invalid!");
        //     app.locals.erreg = 'Password must be 6-20 characters with 1 capital and 1 number';
        //     res.redirect('/register');
        //  }
        // });

    }
})


app.get('/UserAdded', (req, res) => {
    let post = { image: image, name: name, surname: surname, username: username, password: hexPassword, email: email, age: age, gender: gender, sp: sp, bio: bio, sport: sport, fitness: fitness, technology: technology, music: music, gaming: gaming, ageBetween: ageBetween, vkey: vkey, city: city, country: country, postal: postal };
    let sql = 'INSERT INTO users SET ?';
    var sqlCheckIFUserExists = "SELECT * FROM users WHERE username = ?";
    //checks if user exists and insert user data into db

    connection.query(sqlCheckIFUserExists, username, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            connection.query(sql, post, (err, result) => {
                if (err) throw err;
                console.log(result);
                console.log("User created...")
                res.redirect('/');
                //send verification email to user

                app.mailer.send('email', {
                    to: email,
                    subject: 'Matcha Registration',
                    vkey: vkey,
                    port: port
                }, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log('Registration email sent to ' + username);
                })
                console.log("Added user to DB!")
            })
        } else {
            console.log("User Exists!");
            app.locals.erreg = 'User Exists!';
            res.redirect('/register');
        }
    });

});

//verify user account
app.get('/verify', urlencodedParser, (req, res) => {
    var key = req.query.vkey.toString();
    console.log(key);
    // check why error with { $ne: [vkey, 'null'] },                            <--------!!!!!!!
    let verifySql = 'UPDATE users SET verified = true WHERE vkey = ?';

    connection.query(verifySql, key, (err, result) => {
        if (err) throw er;
        if(result.verified == true){
            console.log("User has been verified!");
    }})
    // schema.user.findOneAndUpdate({ vkey: key },
    //     {
    //         $set: {
    //             verified: true
    //         }
    //     }, function (err, data) {
    //         if (err) throw err;
            
    //     })
    res.render('verify');
});
module.exports = app;