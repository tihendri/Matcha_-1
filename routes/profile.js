var express = require('express');
var app = express();
const crypto = require('crypto');
const schema = require('../models/User');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//render profile page
app.get('/profile', (req, res) => {
var UserObject ={};
//-----------------------------------------Get Logged In User info-----------------------------------------
let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
connection.query(userInfoSql, async (err, result) => {
    if (err) throw err;
    result.forEach(function (result) {

        app.locals.visitingUser_id = result.user_id
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
        app.locals.visitingUser = result.username
        req.session.visiting = app.locals.visitingUser
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userObject.fameRating = result.username.split(',').length
            })
        }
    });
        res.render('profile', { name: userObject.name, surname: userObject.surname, username: userObject.username, password: "******", email: userObject.email, age: userObject.age, gender: userObject.gender, sp:userObject.sp , bio: userObject.bio, fameRating: userObject.fameRating,sport: userObject.sport, fitness: userObject.fitness, technology: userObject.technology, music: userObject.music, gaming: userObject.gaming});
    });
});
//Update Profile
// app.post('/profile', upload.single('photo'), urlencodedParser, (req, res) => {
//     schema.user.findOne({ username: req.session.user }, function (err, data) {
//         if (err) throw err;

//         if (req.body.name) {
//             name = req.body.name;
//         }
//         else {
//             name = data.name;
//         }
//         if (req.body.surname) {
//             surname = req.body.surname;
//         }
//         else {
//             surname = data.surname;
//         }
//         if (req.body.username) {
//             username = req.body.username;
//         }
//         else {
//             username = data.username;
//         }
//         if (req.body.password) {
//             var password = req.body.password;
//             const hash = crypto.createHash("sha256");
//             hash.update(password);
//             pass = hash.digest("hex");
//         }
//         else {
//             pass = data.password;
//         }
//         if (req.body.email) {
//             email = req.body.email;
//             app.locals.changedEmail = email

//         }
//         else {
//             email = data.email;
//         }
//         if (req.body.age) {
//             age = req.body.age;
//         }
//         else {
//             age = data.age;
//         }
//         if (req.body.gender) {
           
//             gender = req.body.gender;
            
//         }
//         else {
//             gender = data.gender;
//         }
//         if (req.body.sp) {
//             sp = req.body.sp;
//         }
//         else {
//             sp = data.sp;
//         }
//         if (req.body.bio) {
//             bio = req.body.bio;
//         }
//         else {
//             bio = data.bio;
//         }
//         if (req.body.ageBetween) {
//             ageBetween = req.body.ageBetween;
//         }
//         else {
//             ageBetween = data.ageBetween;
//         }
//         if (req.body.sport) {
//             sport = req.body.sport;
//         }
//         else {
//             sport = "off";
//         }
//         if (req.body.fitness) {
//             fitness = req.body.fitness;
//         }
//         else {
//             fitness = "off";
//         }
//         if (req.body.technology) {
//             technology = req.body.technology;
//         }
//         else {
//             technology = "off";
//         }
//         if (req.body.music) {
//             music = req.body.music;
//         }
//         else {
//             music = "off";
//         }
//         if (req.body.gaming) {
//             gaming = req.body.gaming;
//         }
//         else {
//             gaming = "off";
//         }
//         if (req.file) {
//             image = req.file.buffer.toString('base64');
//             app.locals.image = image
//         }
//         else {
//             image = app.locals.image;
//         }
//         schema.user.findOneAndUpdate({ username: req.session.user },
//             {
//                 $set: {
//                     name: name,
//                     surname: surname,
//                     username: username,
//                     password: pass,
//                     email: email,
//                     age: age,
//                     gender: gender,
//                     sp: sp,
//                     image: image,
//                     bio: bio,
//                     ageBetween: ageBetween,
//                     sport: sport,
//                     fitness: fitness,
//                     technology: technology,
//                     music: music,
//                     gaming: gaming
//                 }
//             }, async function (err, data) {
//                 if (err) throw err;
//                 req.session.user = username;

//                 //Send email when email has been changed   
//                 // })
//                 // if(req.body.email)
//                 // {
//                 //     veri:'false'
//                 // }
//                 // schema.user.findOneAndUpdate({username: req.session.user},
//                 //     {$set:{
//                 //         verified:veri}},async function(err,data){
//                 //             if(err) throw err;
//                 //             //send verify again
//                 //             app.mailer.send('email', {
//                 //                 to: app.locals.changedEmail,
//                 //                 subject: 'Matcha Registration',
//                 //                 vkey: vkey
//                 //             }, function (err) {
//                 //                 if (err) {
//                 //                     console.log(err);
//                 //                     return;
//                 //                 }
//                 //                 console.log('Registration email sent to ' + req.session.user);
//                 //             })})
//                 //             console.log("Added user to DB!")

//                 res.redirect('/home');
//             })
//     })
// })

module.exports = app;