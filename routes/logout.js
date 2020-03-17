var express = require('express');
var app = express();
const schema = require('../models/User');

app.get('/logout', (req, res) => {
    //last seen
    D = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    schema.user.findOneAndUpdate({ username: req.session.user },
        {
            $set: {
                status: "Last Seen: " + D.getHours() + ":" + D.getMinutes() + " - " + D.getDay() + " " + months[D.getMonth()] + " " + D.getFullYear()
            }
        }, function (err, data) {
            if (err) throw err;
        })
    res.redirect('/');
})

module.exports = app;