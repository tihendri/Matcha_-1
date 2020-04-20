var express = require('express');
var app = express();
const schema = require('../models/User');

app.get('/logout', (req, res) => {
    //last seen
    D = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    status = "Last Seen: " + JSON.stringify(D.getHours()) + ":" + JSON.stringify(D.getMinutes()) + " - " + JSON.stringify(D.getDate()) + " " + JSON.stringify(months[D.getMonth()]) + " " + JSON.stringify(D.getFullYear())
    schema.user.findOneAndUpdate({ username: req.session.user },
        {
            $set: {
                status: status
            }
        }, function (err, data) {
            if (err) throw err;
        })
    res.redirect('/');
    destroy.session.user;
})

module.exports = app;