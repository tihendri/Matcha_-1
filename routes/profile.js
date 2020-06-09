var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const bodyParser = require('body-parser');
var config = require('../config.js')
const connection = config.connection;
var port = config.port;
const mailer = require('express-mailer');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//render profile page
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
app.get('/profile', (req, res) => {
    var userObject = {};
    //-----------------------------------------Get Logged In User info-----------------------------------------
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {

            userObject.user_id = result.user_id;
            userObject.status = result.status;
            userObject.fitness = result.fitness;
            userObject.gaming = result.gaming;
            userObject.sport = result.sport;
            userObject.music = result.music;
            userObject.technology = result.technology;
            userObject.name = result.name;
            userObject.email = result.email;
            userObject.surname = result.surname;
            userObject.username = result.username;
            userObject.age = result.age;
            userObject.gender = result.gender;
            userObject.bio = result.bio;
            userObject.sp = result.sp;
        })
        let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
        connection.query(likedByInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    userObject.fameRating = result.username.split(',').length
                })
            }
        });
        res.render('profile', { name: userObject.name, surname: userObject.surname, username: userObject.username, password: "******", email: userObject.email, age: userObject.age, gender: userObject.gender, sp: userObject.sp, bio: userObject.bio, fameRating: userObject.fameRating, sport: userObject.sport, fitness: userObject.fitness, technology: userObject.technology, music: userObject.music, gaming: userObject.gaming });
    });
});
//Update Profile
app.post('/profile', upload.single('photo'), urlencodedParser, (req, res) => {
    var userObject = {};
    //-----------------------------------------Get Logged In User info-----------------------------------------
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {

            userObject.user_id = result.user_id;
            userObject.status = result.status;
            userObject.fitness = result.fitness;
            userObject.gaming = result.gaming;
            userObject.sport = result.sport;
            userObject.music = result.music;
            userObject.technology = result.technology;
            userObject.name = result.name;
            userObject.email = result.email;
            userObject.surname = result.surname;
            userObject.username = result.username;
            userObject.age = result.age;
            userObject.gender = result.gender;
            userObject.bio = result.bio;
            userObject.sp = result.sp;
            userObject.password = result.password;
            userObject.ageBetween = result.ageBetween;
            userObject.image = result.image;
        })
        if (req.body.name) {
            name = req.body.name;
        }
        else {
            name = userObject.name;
        }
        if (req.body.surname) {
            surname = req.body.surname;
        }
        else {
            surname = userObject.surname;
        }
        if (req.body.username) {
            username = req.body.username;
        }
        else {
            username = userObject.username;
        }
        if (req.body.password) {
            var password = req.body.password;
            const hash = crypto.createHash("sha256");
            hash.update(password);
            pass = hash.digest("hex");
        }
        else {
            pass = userObject.password;
        }
        if (req.body.email) {
            email = req.body.email;
            app.locals.changedEmail = email

        }
        else {
            email = userObject.email;
        }
        if (req.body.age) {
            age = req.body.age;
        }
        else {
            age = userObject.age;
        }
        if (req.body.gender) {

            gender = req.body.gender;

        }
        else {
            gender = userObject.gender;
        }
        if (req.body.sp) {
            sp = req.body.sp;
        }
        else {
            sp = userObject.sp;
        }
        if (req.body.bio) {
            bio = req.body.bio;
        }
        else {
            bio = userObject.bio;
        }
        if (req.body.ageBetween) {
            ageBetween = req.body.ageBetween;
        }
        else {
            ageBetween = userObject.ageBetween;
        }
        if (req.body.sport) {
            sport = req.body.sport;
        }
        else {
            sport = "off";
        }
        if (req.body.fitness) {
            fitness = req.body.fitness;
        }
        else {
            fitness = "off";
        }
        if (req.body.technology) {
            technology = req.body.technology;
        }
        else {
            technology = "off";
        }
        if (req.body.music) {
            music = req.body.music;
        }
        else {
            music = "off";
        }
        if (req.body.gaming) {
            gaming = req.body.gaming;
        }
        else {
            gaming = "off";
        }
        if (req.file) {
            image = req.file.buffer.toString('base64');
        }
        else {
            image = userObject.image;
        }
        let updateUserProfile = `UPDATE users SET name = '${name}',surname = '${surname}',username = '${username}',password = '${pass}',email = '${email}',age = '${age}',gender = '${gender}',sp = '${sp}',image = '${image}',bio = '${bio}',ageBetween = '${ageBetween}',sport = '${sport}',fitness = '${fitness}',technology = '${technology}',music = '${music}',gaming = '${gaming}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateUserProfile, async (err, result) => {
            if (err) throw err;
            req.session.user = username;

            if (req.body.email != userObject.email && req.body.email != null) {
                var key = req.session.user + Date.now();
                const hashkey = crypto.createHash("sha256");
                hashkey.update(key);
                vkey = hashkey.digest("hex");
                let updateEmail = `UPDATE users SET verified = false , vkey = '${vkey}' WHERE username = '${req.session.user}'`;
                connection.query(updateEmail, async (err, result) => {
                    if (err) throw err;
                    app.mailer.send('email', {
                        to: app.locals.changedEmail,
                        subject: 'Matcha Registration',
                        vkey: vkey,
                        port: port
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log('Registration email sent to ' + req.session.user);
                    })
                })
                res.redirect('/logout');
            } else {
                console.log('User Profile Updated')
                res.redirect('/profile-page');
            }

        })
    })
})

module.exports = app;