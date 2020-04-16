var express = require('express');
var app = express();
const session = require('express-session');
const schema = require('../models/User');

//View another persons Page
app.get('/visitProfile', (req, res) => {
    console.log(req.session.user);
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        if (data) {
            app.locals.like = data.like;
        }
    }).then(() => {
        var user = req.query.user.toString();
    schema.user.findOne({ username: user }, function (err, data) {
        app.locals.fame = data.likedBy.length
        app.locals.status = data.status
        app.locals.likedBy = data.likedBy
        app.locals.visitingUser = data.username
        function findIndex(str) {
            var index = str.indexOf(app.locals.visitingUser);
            return index
        }
        var count = findIndex(app.locals.like);
        if (count == '-1') {
            app.locals.count = '-1'
        }
        else if (count == '0') {
            app.locals.count = '0'
        }
        app.locals.likeCount = count
        app.locals.visiting = data.username;
        if (err) throw err;
        console.log(app.locals.count)
        console.log('help')
        res.render('visitProfile', { name: req.session.user, like: app.locals.count, status: data.status, to: app.locals.visiting, photo: data.image, name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio, dislike: data.dislike, sport: data.sport, fitness: data.fitness, technology: data.technology, music: data.music, gaming: data.gaming, fame: app.locals.fame });
    })})
    
});

//Display Visiters Gallery
app.get('/visitingGallery', (req, res) => {
    schema.user.findOne({ username: app.locals.visiting }, function (err, data) {
        if (err) throw err;
        if (data) {
            app.locals.visitingGallery = data.gallery
            app.locals.visitingProfilePicture = data.image
            app.locals.status = data.status
        }
        res.render('visitingGallery', { status: app.locals.status, name: req.session.user, gallery: app.locals.visitingGallery, photo: app.locals.visitingProfilePicture });
    });
})

module.exports = app;