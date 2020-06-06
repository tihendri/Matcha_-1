var express = require('express');
var app = express();
const schema = require('../models/User');
const getIP = require('external-ip')();
const iplocation = require("iplocation").default
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});
//Get all users for matching
app.get('/home', (req, res) => {
    //Update IP
    getIP(function (err, ip) {
        if (err) throw err;
        var geo = iplocation(ip, [], function (err, res) {
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
            let updateLocationSql = `UPDATE users SET city = '${city}', country='${country}', postal='${postal}' WHERE username = '${req.session.user}'`;
            connection.query(updateLocationSql, async (err, result) => {
                if (err) throw err;
                console.log("Location Updated");

            });
        })
    })
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        // if(result.length != 0)

        result.forEach(function (result) {
            app.locals.userAge = result.ageBetween;
            app.locals.userCountry = result.country;
            app.locals.userCity = result.city;
            app.locals.userPostal = result.postal;
            app.locals.data = result;
            if (app.locals.data.blocked != null) {
                app.locals.arrayLength = app.locals.data.blocked.length;

            }
            if (app.locals.data.username != null) {
                app.locals.userLength = app.locals.data.username.length;

            }

        })

        //Find if user has been liked
        // var str = []
        // function findIndex(str) {
        //     var index = str.indexOf(app.locals.visiting);
        //     return index
        // }
        // app.locals.like = result.like;
        // var str = app.locals.like

        // var count = findIndex(app.locals.like);
        // if (count == '-1') {
        //     str.push(app.locals.visiting);
        // }
        if (app.locals.data.sp == "Heterosexual") {
            if (app.locals.data.gender == "Male") {
                app.locals.gender = "Female"
            }
            else {
                app.locals.gender = "Male"
            }
        }
        if (app.locals.data.sp == "Homosexual") {
            if (app.locals.data.gender == "Male") {
                app.locals.gender = "Male"
            }
            else {
                app.locals.gender = "Female"
            }
        }
        if (app.locals.data.sp != "Bisexual") {
            var str = user.username
            if (app.locals.data.blocked != null) {
                app.locals.arrayLength = app.locals.data.blocked.length;

            }
            else {
                app.locals.arrayLength = 0;
            }
            if (app.locals.data.username != null) {
                app.locals.userLength = app.locals.data.username.length;
            }
            else {
                app.locals.userLength = 0;
            }
            // var str = []
            // function findIndex(str) {
            //     var index = str.indexOf(app.locals.visiting);
            //     return index
            // }
            // app.locals.like = result.like;
            // var str = app.locals.like

            // var count = findIndex(app.locals.like);
            // if (count == '-1') {
            //     str.push(app.locals.visiting);
            // }
            count = 0;
            let userInfoSql = `SELECT * FROM users WHERE sp = '${app.locals.data.sp}'AND gender = '${app.locals.gender}' AND sport= '${app.locals.data.sport}' AND fitness='${app.locals.data.fitness}' AND technology = '${app.locals.data.technology}' AND music = '${app.locals.data.music}' AND gaming = '${app.locals.data.gaming}'`;

            connection.query(userInfoSql, async (err, result) => {
                var userArray = [];
                console.log(user);
                result.forEach(function (result) {
                    verified = result.verified;
                    userArray.push(result);
                    // userArray.push(result.image);
                })
                // schema.user.find({ like: req.session.user }, function (err, data) {

                // })
                // schema.user.find({
                //     sp: app.locals.data.sp,
                //     gender: app.locals.gender,
                //     sport: app.locals.data.sport,
                //     fitness: app.locals.data.fitness,
                //     technology: app.locals.data.technology,
                //     music: app.locals.data.music,
                //     gaming: app.locals.data.gaming,
                //     username: { $ne: req.session.user }
                // }, function (err, data) {
                if (err) throw err;
                if (result.length != 0) {
                    res.render('home', { user: userArray, username: req.session.user, locationTest: '0', name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                }
            })
        }
        else {
            let userInfoSql = `SELECT * FROM users WHERE sp = '${app.locals.data.sp}' AND sport= '${app.locals.data.sport}' AND fitness='${app.locals.data.fitness}' AND technology = '${app.locals.data.technology}' AND music = '${app.locals.data.music}' AND gaming = '${app.locals.data.gaming}' '`;

            connection.query(userInfoSql, async (err, result) => {
                if (err) throw err;
                var r = JSON.stringify(result);


                // console.log(result.username)
                res.render('home', { locationTest: '0', user: r, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });

            })
        }
    }
    );
});

module.exports = app;