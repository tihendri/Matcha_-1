var express = require('express');
var app = express();
const schema = require('../models/User');
const getIP = require('external-ip')();
const iplocation = require("iplocation").default
var mysql = require('mysql');
var blockedUsers = [];
var userObject = {};
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
            req.session.user_id = result.user_id;
            app.locals.userAge = result.ageBetween;
            app.locals.userCountry = result.country;
            app.locals.userCity = result.city;
            app.locals.userPostal = result.postal;
            // userArray.push(result)
            userObject.gender = result.gender;
            userObject.sp = result.sp;
            userObject.sport = result.sport;
            userObject.fitness = result.fitness;
            userObject.gaming = result.gaming;
            userObject.music = result.music;
            userObject.technology = result.technology;
           
        })
        let blockedInfoSql = `SELECT * FROM blocked WHERE ID = '${req.session.user_id}'`;
    connection.query(blockedInfoSql, async (err, result) => {
        if (err) throw err;
        
        result.forEach(function(result){
            if(result.user_id == req.session.user_id)
            {
                blockedUsers.push(result.user_id);
            }
        })

    });
    if (blockedUsers != null) {
        app.locals.arrayLength = blockedUsers.length;

    }else{
        app.locals.arrayLength = 0;
    }
    // if (userArray.username != null) {
    //     app.locals.userLength = userArray.username.length;
    // }else{
    //     app.locals.userLength = 0;
    // }

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
            var str = user.username
            if (blockedUsers != null) {
                app.locals.arrayLength =blockedUsers.length;

            }
            else {
                app.locals.arrayLength = 0;
            }
            // if (userArray.username != null) {
            //     app.locals.userLength = userArray.username.length;
            // }
            // else {
            //     app.locals.userLength = 0;
            // }
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
            let userInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}'`;

            connection.query(userInfoSql, async (err, result) => {
                var usersArray = [];
                
                result.forEach(function (result) {
                    usersArray.push(result);
                    
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
                
                    res.render('home', { user: usersArray, username: req.session.user, locationTest: '0', name: req.session.user, blocked: blockedUsers, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                
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
                res.render('home', { locationTest: '0', user: usersArray, name: req.session.user, blocked: blockedUsers, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });

            })
        }
    }
    );
});

module.exports = app;