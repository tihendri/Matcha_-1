var express = require('express');
var app = express();
const schema = require('../models/User');
const getIP = require('external-ip')();
const iplocation = require("iplocation").default

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
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        if (data) {
            app.locals.userAge = data.ageBetween;
            app.locals.userCountry = data.country;
            app.locals.userCity = data.city;
            app.locals.userPostal = data.postal;
            app.locals.data = data;
            app.locals.arrayLength = app.locals.data.blocked.length;
            app.locals.userLength = app.locals.data.username.length;

            if (data.status == "false") {
                status = "true"
                console.log('logged in')
            }
            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                        status: "true"
                    }
                }, async function (err, data) {
                    if (err) throw err;
                })
            //Find if user has been liked
            var str = []
            function findIndex(str) {
                var index = str.indexOf(app.locals.visiting);
                return index
            }
            app.locals.like = data.like;
            var str = app.locals.like

            var count = findIndex(app.locals.like);
            if (count == '-1') {
                str.push(app.locals.visiting);
            }
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
                app.locals.arrayLength = app.locals.data.blocked.length;
                app.locals.userLength = app.locals.data.username.length;
                var str = []
                function findIndex(str) {
                    var index = str.indexOf(app.locals.visiting);
                    return index
                }
                app.locals.like = data.like;
                var str = app.locals.like

                var count = findIndex(app.locals.like);
                if (count == '-1') {
                    str.push(app.locals.visiting);
                }
                count = 0;
                schema.user.find({ like: req.session.user }, function (err, data) {
                })
                schema.user.find({
                    sp: app.locals.data.sp,
                    gender: app.locals.gender,
                    sport: app.locals.data.sport,
                    fitness: app.locals.data.fitness,
                    technology: app.locals.data.technology,
                    music: app.locals.data.music,
                    gaming: app.locals.data.gaming,
                    username: { $ne: req.session.user }
                }, function (err, data) {
                    if (err) throw err;
                    if (data) {
                        res.render('home', { username: data.username, locationTest: '0', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }
                })
            }
            else {
                schema.user.find({
                    sp: app.locals.data.sp,
                    sport: app.locals.data.sport,
                    fitness: app.locals.data.fitness,
                    technology: app.locals.data.technology,
                    music: app.locals.data.music,
                    gaming: app.locals.data.gaming,
                    username: { $ne: req.session.user }
                }, function (err, data) {
                    if (data) {
                        console.log(data.username)
                        res.render('home', { username: data.username, locationTest: '0', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }
                })
            }
        }
    })
});

module.exports = app;