var express = require('express');
var app = express();
var config = require('../config.js')
const connection = config.connection;


app.get('/logout', (req, res) => {
    //last seen
    var offline = "offline"
    D = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var day = JSON.stringify(D.getDate());
    if (parseInt(day) < 10)
        day = "0" + day;
    status = "Last Seen: " + JSON.stringify(D.getHours()) + ":" + JSON.stringify(D.getMinutes()) + " - " + JSON.stringify(D.getDate()) + " " + JSON.stringify(months[D.getMonth()]) + " " + JSON.stringify(D.getFullYear())
    let updateStatus = `UPDATE users SET status = '${status}' WHERE username = '${req.session.user}'`;
    connection.query(updateStatus, async (err, result) => {
        if (err) throw err;
        console.log("Signed user out")
        res.redirect('/');
    })
    req.session.destroy();
})
module.exports = app;