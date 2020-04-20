var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/sort', (req, res) => {
    res.render('sort',{name: req.session.user})
});
//Sorting
app.post('/sort', urlencodedParser, (req, res) => {
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (data) {
            app.locals.userCity = data.city;
            app.locals.userPostal = data.postal;
            app.locals.data = data;
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
            if (app.locals.data.sp == "Heterosexual") {
                if (app.locals.data.gender == "Male") {
                    app.locals.gender = "Female"
                }
                else
                    app.locals.gender = "Male"
            }
            if (app.locals.data.sp == "Homosexual") {
                if (app.locals.data.gender == "Male") {
                    app.locals.gender = "Male"
                }
                else
                    app.locals.gender = "Female"
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
                schema.user.find({ like: req.session.user }, function (err, data) {

                })
                app.locals.number = '0'

                if (req.body.ascAge == 'on') {
                    app.locals.number = '1'
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
                        res.render('home', { locationTest: '1', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCounty: app.locals.userCountry, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }).sort({ age: app.locals.number })
                } else if (req.body.descAge == 'on') {
                    app.locals.number = '-1'
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
                        res.render('home', { locationTest: '1', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCounty: app.locals.userCountry, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }).sort({ age: app.locals.number })
                } else if (req.body.fameRating == 'on') {
                    app.locals.number = '1'
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
                        res.render('home', { locationTest: '1', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCounty: app.locals.userCountry, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }).sort({ likedBy: app.locals.number })

                } else if (req.body.location == 'on') {
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
                        res.render('home', { locationSort: '1', locationTest: '1', user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageIsValid: app.locals.age, ageBetween: app.locals.userAge, userCounty: app.locals.userCountry, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
                    }
                    )
                }

                //Still need to sort by location!!!!!!  

                else {
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
                        if (data) {
                            res.render('home', { locationTest: '0', userCity: app.locals.userCity, userPostal: app.locals.userPostal, user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageBetween: app.locals.userAge });
                        }
                    })
                }
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
                        res.render('home', { locationTest: '0', userCity: app.locals.userCity, userPostal: app.locals.userPostal, user: data, name: req.session.user, blocked: app.locals.data.blocked, length: app.locals.arrayLength, userLength: app.locals.userLength, ageBetween: app.locals.userAge });
                    }
                })
            }
        }
    })
});

module.exports = app;