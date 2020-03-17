var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//render filterSeach page
app.get('/filteredSearch', (req, res) => {
    schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;
        res.render('filteredSearch', { name: req.session.user, gender: data.gender, sp: data.sp });
    });
});

//Advanced Search
app.post('/filterSearch', urlencodedParser, (req, res) => {
    app.locals.filterSearch = req.body
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (data) {
            if (err) throw err;
            app.locals.filterSearch = data
            if (req.body.sport == null) {
                req.body.sport = "off"
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

            schema.user.find({
                sp: req.body.sp,
                gender: req.body.gender,
                sport: req.body.sport,
                fitness: req.body.fitness,
                technology: req.body.technology,
                music: req.body.music,
                gaming: req.body.gaming,
                username: { $ne: req.session.user }
            }, function (err, data) {
                res.render('filterResults', { fameBetween: req.body.fameBetween, name: req.session.user, userCity: app.locals.userCity, userPostal: app.locals.userPostal, sameLocation: app.locals.sameLocation, user: data, ageBetween: req.body.ageBetween, userCounty: app.locals.userCountry, userCity: app.locals.userCity, userPostal: app.locals.userPostal });
            })
        }
    })
});

module.exports = app;