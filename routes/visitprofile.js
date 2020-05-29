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
            app.locals.userlikedBy = data.likedBy
            req.session.viewedHistory = data.viewedProfileHistory
            console.log("viewed History "+req.session.viewedHistory)
            console.log("liked History1 "+req.session.like)
            console.log("liked History2 "+data.like)
            console.log("userlikedBy 1 "+app.locals.userlikedBy)
        }
    
        var user = req.query.user.toString();
        req.session.visiting = user
        schema.user.findOne({ username: user }, function (err, data) {
        app.locals.fame = data.likedBy.length
        app.locals.status = data.status
        app.locals.likedBy = data.likedBy
        app.locals.viewedBy = data.viewedBy
        app.locals.visitingUser = data.username
        // req.session.visiting = app.locals.visitingUser

        console.log("visitingUser app.locals "+req.session.visiting)
        function findIndex(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        console.log("like app.locals "+req.session.like)
        if(req.session.like)
        var count = findIndex(req.session.like);
        console.log("like count "+count)
        if (count == true) {
            app.locals.likeCount = '0'
        }
        else if (count == false){
            app.locals.likeCount = '-1'
        }

        //check if viewed
        req.session.likeOrUnlike = count;
        app.locals.visiting = data.username;
        req.session.visiting = app.locals.visiting;
        app.locals.likeList= data.like;
        //Check if the user you are visiting has liked your profile
        function findIndexOfUsername(str) {
            var index = str.includes(req.session.user);
            console.log(index);
            console.log("21 "+req.session.user);
            return index
        }
        var userLikesYouCount = findIndexOfUsername(app.locals.likeList);
        console.log("user likes you count ="+ userLikesYouCount)
        
        if (err) throw err;
        if(userLikesYouCount == false)
        {
            app.locals.userLikesYouCount = 0;
        }
        else if(userLikesYouCount == true)
        {
            app.locals.userLikesYouCount = 1;
        }
        console.log("like value "+ app.locals.likeCount)
        //Update ViewedBy in database

        function findIndexOfUserInViewedBy(str) {
            var index = str.includes(req.session.user);
            console.log(index);
            return index
        }
        //Update ViewHistory in database
        
        function findIndexOfUserInViewedHistory(str) {
            var index = str.includes(req.session.visiting);
            console.log(index);
            return index
        }
        
        var viewedBy = app.locals.viewedBy
        var viewedHistory = req.session.viewedHistory
        console.log("This is the viewedHistory = "+viewedHistory)
        console.log("This is the visiting user = "+req.session.visiting)

        var viewedCount = findIndexOfUserInViewedBy(app.locals.viewedBy);
        var viewedHistoryCount = findIndexOfUserInViewedHistory(viewedHistory);
    console.log("This is viewedHistoryCount = "+viewedHistoryCount)
    console.log("This is iewedCount = "+viewedCount)
        if (viewedCount == false) {
            viewedBy.push(req.session.user);
            console.log('User Profile viewewdBy')
            app.locals.viewedCount = '1'
            
        }
    
        if (viewedHistoryCount == false) {
            viewedHistory.push(req.session.visiting);
            console.log('User Profile viewedHistory')
            app.locals.viewedHistoryCount = '1'
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
            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                       
                        viewedProfileHistory: viewedHistory
    
                    }
                }, async function (err, data) {
                    if (err) throw err;
                   
                })
                console.log(" likedBy "+ app.locals.userlikedBy +" like "+req.session.like +" visiting "+req.session.visiting);
            var connectedTest1 = app.locals.userlikedBy.includes(req.session.visiting)
            var connectedTest2 = req.session.like.includes(req.session.visiting)
            console.log("connectedTest1 "+connectedTest1);
            console.log("connectedTest2 "+connectedTest2);
            if(connectedTest1 == true && connectedTest2 == true){
                var connected = 1;
                
            }else{
                var connected = 0;
                
            }



        res.render('visitProfile', {connected: connected,uname: req.session.user,userLikeYou:app.locals.userLikesYouCount,like: app.locals.likeCount,status: data.status, to: req.session.visiting , photo: data.image, name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio, dislike: data.dislike, sport: data.sport, fitness: data.fitness, technology: data.technology, music: data.music, gaming: data.gaming, fame: app.locals.fame });
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