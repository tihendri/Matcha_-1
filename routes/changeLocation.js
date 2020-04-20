var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/changeLocation',(req,res) => {

    console.log('changelocation area')
    res.render('changeLocation',{name: req.session.user})
    
})

//Change Location
app.post('/changeLocation', urlencodedParser, (req, res) => {
    console.log('area2')
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        if (data) {
            if (req.body.city) {
                if (data.city != req.body.city) {
                    city = req.body.city;
                }
            }
            else
                city = data.city
            if (req.body.postal) {
                if (data.postal != req.body.postal) {
                    postal = req.body.postal;
                }
            }
            else
                postal = data.postal
            console.log(res)
            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                        city: city,
                        postal: postal,
                    }
                }, async function (err, data) {
                    if (err) throw err;
                    console.log('location Changed')
                    res.redirect('profile-page')
                })
        }
    });
});

module.exports = app;