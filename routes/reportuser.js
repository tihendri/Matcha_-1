var express = require('express');
var app = express();
const mailer = require('express-mailer');
var config = require('../config.js')
var port = config.port;

mailer.extend(app, {
    from: 'matchaprojectsup@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'matchaprojectsup@gmail.com',
        pass: 'Matcha123'
    }
})

//Report User Profile
app.post('/reportUser', (req, res) => {
    app.mailer.send('report', {
        to: 'matchaprojectsup@gmail.com',
        subject: app.locals.visiting + 'has been reported by' + req.session.user,
        user: req.session.user,
        repuser: app.locals.visiting
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(app.locals.visiting + ' has been reported');
    });
    res.redirect('home');
})

module.exports = app;