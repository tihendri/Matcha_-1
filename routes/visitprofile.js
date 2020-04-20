var express = require('express');
var app = express();
const session = require('express-session');
const schema = require('../models/User');

//View another persons Page
app.get('/visitProfile', async (req, res) => {
    console.log(req.session.user);
    await schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        if (data) {
            req.session.like = data.like;
            app.locals.viewed = data.viewed;
           
        }
    }).then(() => {
        var user = req.query.user.toString();
        req.session.visiting = user
    schema.user.findOne({ username: user }, function (err, data) {
        app.locals.fame = data.likedBy.length
        app.locals.status = data.status
        app.locals.likedBy = data.likedBy
        app.locals.viewedBy = data.viewedBy
        app.locals.visitingUser = data.username
        app.locals.viewedBy = data.viewedBy
        // req.session.visiting = app.locals.visitingUser

        console.log("visitingUser app.loclas "+req.session.visiting)
        function findIndex(str) {
            var index = str.indexOf(req.session.visiting);
            return index
        }
        console.log("like app.loclas "+req.session.like)
        if(req.session.like)
        var count = findIndex(req.session.like);
        console.log("like count "+count)
        if (count == '1') {
            app.locals.count = '0'
        }
        else if ((count == '-1') || (count == '0')){
            app.locals.count = '-1'
        }
        //check if viewed
        app.locals.likeCount = count
        req.session.likeOrUnlike = count;
        app.locals.visiting = data.username;
        req.session.visiting = app.locals.visiting;
        app.locals.likeList= data.like;
        //Check if the user you are visiting has liked your profile
        function findIndexOfUsername(str) {
            var index = str.indexOf(req.session.user);
            console.log(index);
            console.log("21 "+req.session.user);
            return index
        }
        var viewedCount = findIndexOfUsername(app.locals.likeList);
        console.log("user likes you count ="+ viewedCount)
        if (err) throw err;
        console.log("like value "+ app.locals.count)
        //Update ViewedBy in database

        function findIndexOfUserInViewedBy(str) {
            var index = str.indexOf(req.session.user);
            console.log(index);
            return index
        }
        
        var viewedBy = app.locals.viewedBy

        var viewedCount = findIndexOfUserInViewedBy(app.locals.viewedBy);
        if (viewedCount == '-1') {
            viewedBy.push(req.session.user);
            console.log('User Profile viewewdBy')
            app.locals.viewedCount = '0'
            
        }
        console.log('this is the uname '+req.session.user)
        schema.user.findOneAndUpdate({ username: app.locals.visiting },
            {
                $set: {
                    viewedBy: viewedBy
                }
            }, async function (err, data) {
                if (err) throw err;
               
            })
   

        res.render('visitProfile', {uname: req.session.user,userLikeYou:viewedCount,like: app.locals.count,status: data.status, to: req.session.visiting , photo: data.image, name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio, dislike: data.dislike, sport: data.sport, fitness: data.fitness, technology: data.technology, music: data.music, gaming: data.gaming, fame: app.locals.fame });
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