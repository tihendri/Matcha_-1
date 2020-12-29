var express = require('express');
var app = express();
// const schema = require('../models/User');
const bodyParser = require('body-parser');
var config = require('../config.js')
const connection = config.connection;
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//render filterSeach page
app.get('/filteredSearch', (req, res) => {
    var userObject = {}
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userObject.gender = result.gender;
                userObject.sp = result.sp;
                userObject.ageBetween = result.ageBetween;
                userObject.sport = result.sport;
                userObject.fitness = result.fitness;
                userObject.gaming = result.gaming;
                userObject.music = result.music;
                userObject.technology = result.technology;

            })
        }
        // schema.user.findOne({ username: req.session.user }, async function (err, data) {
        //     if (err) throw err;
        res.render('filteredSearch', { name: req.session.user, gender: userObject.gender, sp: userObject.sp, ageBetween: userObject.ageBetween });
    });
});

//Advanced Search
app.post('/filterSearch', urlencodedParser, (req, res) => {
    var userObject = {}
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userObject.gender = result.gender;
                userObject.sp = result.sp;
                userObject.ageBetween = result.ageBetween;
                userObject.sport = result.sport;
                userObject.fitness = result.fitness;
                userObject.gaming = result.gaming;
                userObject.music = result.music;
                userObject.technology = result.technology;
                userObject.city = result.city;
                userObject.postal = result.postal;

            })

            if (err) throw err;
            if (req.body.gender == null) {
                if (userObject.gender == 'Female') {
                    req.body.gender = 'Male'

                } else {
                    req.body.gender = 'Female'

                }
            }
            if (req.body.sp == null) {
                req.body.sp = userObject.sp
            }

            if (req.body.ageBetween == null) {
                req.body.ageBetween = userObject.ageBetween
            }
            if (req.body.fameBetween == null) {
                req.body.fameBetween = '0-17'
            }
            if (req.body.sport == null) {
                req.body.sport = 'off'
            }
            if (req.body.fitness == null) {
                req.body.fitness = 'off'
            }
            if (req.body.technology == null) {
                req.body.technology = 'off'
            }
            if (req.body.music == null) {
                req.body.music = 'off'
            }
            if (req.body.gaming == null) {
                req.body.gaming = 'off'
            }
            if (req.body.sameLocation == null) {
                app.locals.sameLocation = '0'
            }
            else {
                app.locals.sameLocation = '1'
            }
            console.log("gender = " + req.body.gender)
            console.log("sp = " + req.body.sp)
            console.log("agebetween = " + req.body.ageBetween)
            console.log(" gaming = " + req.body.gaming)
            console.log("fitness = " + req.body.fitness)
            console.log("technology = " + req.body.technology)
            console.log("music = " + req.body.music)
            console.log("sameLocation = " + app.locals.sameLocation)

            let likedByInfoSql = `SELECT username FROM likedBy WHERE user_id != '${req.session.user_id}'`;
            connection.query(likedByInfoSql, async (err, result) => {
                if (err) throw err;
                if (result) {
                    result.forEach(function (result) {
                        if (result.username) {
                            app.locals.fameRating = ((result.username.split(',').length) - 1)
                        } else {
                            app.locals.fameRating = 0
                        }
                    })
                }

                var searchedUserObject = []
                let searchInfoSql = `SELECT * FROM users WHERE sp ='${req.body.sp}'AND gender = '${req.body.gender}' AND sport = '${req.body.sport}' AND fitness='${req.body.fitness}' AND technology ='${req.body.technology}' AND music = '${req.body.music}' AND gaming = '${req.body.gaming}' AND username != '${req.session.user}'`;
                connection.query(searchInfoSql, async (err, result) => {
                    if (err) throw err;
                    if (result) {
                        result.forEach(element => {
                            searchedUserObject.push(element)
                        });
                        console.log("full object")

                        res.render('filterResults', { user: searchedUserObject, name: req.session.user, sameLocation: app.locals.sameLocation, userCity: userObject.city, userPostal: userObject.postal, ageBetween: req.body.ageBetween, fameBetween: req.body.fameBetween, fameRating: app.locals.fameRating })
                    } else {
                        console.log("Emty object")
                        res.render('filterResults', { user: searchedUserObject, name: req.session.user, sameLocation: app.locals.sameLocation, userCity: userObject.city, userPostal: userObject.postal, ageBetween: req.body.ageBetween, fameBetween: req.body.fameBetween, fameRating: app.locals.fameRating })
                    }

                }

                )
            });
        }
    })
})

module.exports = app;