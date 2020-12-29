var express = require('express');
var app = express();
const crypto = require('crypto');
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
const connection = config.connection;

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

//Get all Users
app.get('/register', (req, res) => {

    if (app.locals.erreg == undefined)
        app.locals.erreg = 'Please fill in the form to register!';
    res.render('register', { erreg: app.locals.erreg });
});

//Adding User to DB!
app.post('/register', upload.single('photo'), urlencodedParser, async function (req, res) {
    //validate password
    if (validate.checkPassword(req.body.password) == true) {
        //hash password and vkey
        username = req.body.username.charAt(0).toUpperCase() + req.body.username.substring(1).toLowerCase();
        var password = req.body.password;
        var key = req.body.username + Date.now();
        const hashpw = crypto.createHash("sha256");
        const hashkey = crypto.createHash("sha256");
        hashpw.update(password);
        hashkey.update(key);
        password = hashpw.digest("hex"),
            vkey = hashkey.digest("hex");
        if (req.body.age >= 18) {
            var sqlCheckIfUserExists = `SELECT username FROM users WHERE username = '${req.body.username}'`;
            connection.query(sqlCheckIfUserExists, (err, result) => {
                if (err) throw err;
                if (result.length != 0) {
                    console.log(req.body.email);
                    console.log("Username Exists!");
                    app.locals.erreg = 'Username Exists!';
                    res.render('register', { erreg: app.locals.erreg })
                } else {
                    var sqlCheckIfEmailExists = `SELECT email FROM users WHERE email = '${req.body.email}'`;
                    //checks if user exists and insert user data into db
                    app.locals.erreg = null;

                    connection.query(sqlCheckIfEmailExists, (err, result) => {
                        if (err) throw err;
                        if (result.length != 0) {
                            console.log(req.body.email);
                            console.log("Email Exists!");
                            app.locals.erreg = 'Email Exists!';
                            res.render('register', { erreg: app.locals.erreg })

                        } else {
                            app.locals.erreg = null;
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
                        }
                    })
                }
                app.locals.erreg = undefined;
            }
            )
        }
        else {
            console.log('User needs to be 18 or older');
            app.locals.erreg = 'User must be 18 or older to register!';
            res.redirect('/register');
        }
    } else {
        console.log('Password invalid');
        app.locals.erreg = 'Password must contain a Capital letter ,Lowercase letter, a number and be longer than 5 characters !';
        res.redirect('/register');
    }
})

app.get('/UserAdded', async (req, res) => {
    let post = { image: image, name: name, surname: surname, username: username, password: hexPassword, email: email, age: age, gender: gender, sp: sp, bio: bio, sport: sport, fitness: fitness, technology: technology, music: music, gaming: gaming, ageBetween: ageBetween, vkey: vkey, city: city, country: country, postal: postal };
    let sql = 'INSERT INTO users SET ?';

    var getUserIDSql = `SELECT * FROM users WHERE username = '${username}'`;
    //checks if user exists and insert user data into db
    connection.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log("User created...")
        connection.query(getUserIDSql, (err, result) => {
            if (err) throw err;
            var getUser_id;
            if (result.length != 0) {
                result.forEach(element => {
                    getUser_id = element.user_id;
                });
                //Set liked row to null to update later
                let setLikedRow = `INSERT INTO liked SET user_id = '${getUser_id}' `
                connection.query(setLikedRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created liked Row...')
                })
                //Set likedBy row to null to update later
                let setLikedByRow = `INSERT INTO likedBy SET user_id = '${getUser_id}' `
                connection.query(setLikedByRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created likedBy Row...')
                })
                //Set blocked row to null to update later
                let setBlockedRow = `INSERT INTO blocked SET user_id = '${getUser_id}' `
                connection.query(setBlockedRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created blocked Row...')
                })
                //Set gallery row to null to update later

                let setGalleryRow = `INSERT INTO gallery SET user_id = '${getUser_id}' `
                connection.query(setGalleryRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created gallery Row...')
                })
                //Set viewedBy row to null to update later
                let setViewedByRow = `INSERT INTO viewedBy SET user_id = '${getUser_id}' `
                connection.query(setViewedByRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created viewedBy Row...')
                })

                //Set viewedProfileHistory row to null to update later
                let viewedProfileHistoryRow = `INSERT INTO viewedProfileHistory SET user_id = '${getUser_id}'`
                connection.query(viewedProfileHistoryRow, (err, result) => {
                    if (err) throw err;
                    console.log('Created viewedBy Row...')
                })
            }
        })
        //send verification email to user
        res.redirect('/');
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
                console.log("Postal code = " + app.locals.postal)
            }
            console.log("Postal code = " + app.locals.postal)
            let updateLocationSQL = `UPDATE users SET city = '${app.locals.city}',country ='${app.locals.country}',postal ='${app.locals.postal}' WHERE username ='${username}'`
            connection.query(updateLocationSQL, (err, result) => {

                if (err) throw err;
                console.log('Updated location...')
            })
        })
    })
}
)

//verify user account
app.get('/verify', urlencodedParser, (req, res) => {
    var key = req.query.vkey.toString();
    console.log(key);
    let verifySql = `UPDATE users SET verified = true WHERE vkey = ?`;
    connection.query(verifySql, key, (err, result) => {
        if (err) throw err;
        if (result.verified == 1) {
            console.log("User has been verified!");
        }
    })
    res.render('verify');
});
module.exports = app;