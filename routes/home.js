var express = require('express');
var app = express();
const getIP = require('external-ip')();
const iplocation = require("iplocation").default
var config = require('../config.js')
const connection = config.connection;
var blockedUsers = [];
var userObject = {};

//Get all users for matching
app.get('/home', (req, res) => {
    if(req.session.user == undefined){
        res.redirect('/')
    }
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
    //WEIRD if you don't call this the session user does not update????
    console.log("Session user == " + req.session.user)
    //-----------------------------------------------------------------
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                req.session.user_id = result.user_id;
                app.locals.userAge = result.ageBetween;
                app.locals.userCountry = result.country;
                app.locals.userCity = result.city;
                app.locals.userPostal = result.postal;
                userObject.gender = result.gender;
                userObject.sp = result.sp;
                userObject.sport = result.sport;
                userObject.fitness = result.fitness;
                userObject.gaming = result.gaming;
                userObject.music = result.music;
                userObject.technology = result.technology;

            })
        }
        let blockedInfoSql = `SELECT * FROM blocked WHERE user_id = '${req.session.user_id}'`;
        connection.query(blockedInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                blockedUsers = [];
                result.forEach(function (result) {
                    blockedUsers.push(result.username)
                })
            }
        })
        if (blockedUsers) {
            app.locals.arrayLength = blockedUsers.length;

        } else {
            app.locals.arrayLength = 0;
        }
        if (userObject.sp == "Heterosexual") {
            if (userObject.gender == "Male") {
                app.locals.gender = "Female"
            }
            else {
                app.locals.gender = "Male"
            }
        }
        if (userObject.sp == "Homosexual") {
            if (userObject.gender == "Male") {
                app.locals.gender = "Male"
            }
            else {
                app.locals.gender = "Female"
            }
        }
        if (userObject.sp != "Bisexual") {
            if (blockedUsers) {
                app.locals.arrayLength = blockedUsers.length;
            }
            else {
                app.locals.arrayLength = 0;
            }

            count = 0;
            let userInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}'`;

            connection.query(userInfoSql, async (err, result) => {
                var usersArray = [];

                result.forEach(function (result) {
                    usersArray.push(result);
                })
                if (err) throw err;
                res.render('home', { user: usersArray, username: req.session.user, locationTest: '0', name: req.session.user, blocked: blockedUsers, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
            })
        }
        else {
            let userInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}' '`;
            connection.query(userInfoSql, async (err, result) => {
                if (err) throw err;
                var usersArray = [];
                result.forEach(function (result) {
                    usersArray.push(result);

                })
                res.render('home', { locationTest: '0', user: usersArray, name: req.session.user, blocked: blockedUsers, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
            })
        }
    }
    );
});

module.exports = app;