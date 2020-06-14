var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var config = require('../config.js')
const connection = config.connection;
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/sort', (req, res) => {
    res.render('sort', { name: req.session.user })
});
//Sorting
app.post('/sort', urlencodedParser, (req, res) => {
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    let allUsersInfoSql;
    var blockedUsers = [];
    var userObject = {};
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
            if (req.body.ascAge == 'on') {
                allUsersInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}' ORDER BY age ASC`;

            } else if (req.body.descAge == 'on') {
                allUsersInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}' ORDER BY age DESC`;

            } else if (req.body.fameRating == 'on') {
                allUsersInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}' ORDER BY liked ASC`;
            } else if (req.body.location == 'on') {
                allUsersInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}'ORDER BY city ASC`;
            } else {
                allUsersInfoSql = `SELECT * FROM users WHERE sp = '${userObject.sp}'AND gender = '${app.locals.gender}' AND sport= '${userObject.sport}' AND fitness='${userObject.fitness}' AND technology = '${userObject.technology}' AND music = '${userObject.music}' AND gaming = '${userObject.gaming}'`;

            }
            connection.query(allUsersInfoSql, async (err, result) => {
                var usersArray = [];

                if(result){
                result.forEach(function (result) {
                    usersArray.push(result);
                })
            }
                if (err) throw err;

                res.render('home', { user: usersArray, username: req.session.user, locationTest: '1', name: req.session.user, blocked: blockedUsers, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });

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
                res.render('home', { locationTest: '1', user: usersArray, name: req.session.user, blocked: blockedUsers, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });

            })
        }
    }
    );
})

module.exports = app;