var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
var config = require('../config.js')
const connection = config.connection;

app.get('/changeLocation', (req, res) => {

    console.log('changelocation area')
    res.render('changeLocation', { name: req.session.user })

})

//Change Location
app.post('/changeLocation', urlencodedParser, (req, res) => {
    var userObject = {}
    console.log('area2')
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {
            userObject.city = result.city;
            userObject.post = result.postal;
        })
        if (req.body.city) {
            if (userObject.city != req.body.city) {
                city = req.body.city;
            }
        }
        else
            city = userObject.city
        if (req.body.postal) {
            if (userObject.post != req.body.postal) {
                postal = req.body.postal;
            }
        }
        else
            postal = userObject.post
        let updateLocation = `UPDATE users SET city = '${city}',postal= '${postal}'  WHERE username = '${req.session.user}'`;
        connection.query(updateLocation, async (err, result) => {
            if (err) throw err;
            console.log('location Changed')
            res.redirect('profile-page')
        })
    })
});

module.exports = app;