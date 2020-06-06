var express = require('express');
var app = express();
const session = require('express-session');
const schema = require('../models/User');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});
var userInfo = []
//View another persons Page
app.get('/visitProfile', async (req, res) => {
    console.log(req.session.user);
    
    let UserInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(UserInfoSql, async (err, result) => {
        result.forEach(function (result) {
            console.log(result.username)

            req.session.like = result.like;
            app.locals.viewed = result.viewed;
            app.locals.userlikedBy = result.likedBy
            req.session.viewedHistory = result.viewedProfileHistory
            console.log("viewed History "+req.session.viewedHistory)
            console.log("liked History1 "+req.session.like)
            console.log("liked History2 "+result.like)
            console.log("userlikedBy 1 "+app.locals.userlikedBy)
            // userArray.push(result.image);
        })
    //  await schema.user.findOne({ username: req.session.user }, function (err, data) {
    
        var user = req.query.user.toString();
        req.session.visiting = user
        var visitingInfo = [];
        let visitinUserInfoSql = `SELECT * FROM users WHERE username = '${user}'`;
        connection.query(visitinUserInfoSql, async (err, result) => {
            if (err) throw err;
            result.forEach(function (result) {
                app.locals.status = result.status
                app.locals.likedBy = result.likedBy
                app.locals.viewedBy = result.viewedBy
                app.locals.visitingUser = result.username
                req.session.visiting = app.locals.visitingUser
                app.locals.likeList= result.like;
                // userArray.push(result.image);
            })
            console.log("visiting user = "+ app.locals.visitingUser)
        // schema.user.findOne({ username: user }, function (err, data) {
        // app.locals.fame = result.likedBy.length
       

        console.log("visitingUser app.locals "+req.session.visiting)
        function findIndex(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        console.log("like app.locals "+req.session.like)
        if(req.session.like){
        var count = findIndex(req.session.like);
        console.log("like count "+count)
        }
        if (count == true) {
            app.locals.likeCount = '0'
        }
        else if (count == false){
            app.locals.likeCount = '-1'
        }

        //check if viewed
        req.session.likeOrUnlike = count;
        // app.locals.visiting = result.username;
        // req.session.visiting = app.locals.visiting;
        // app.locals.likeList= result.like;
        //Check if the user you are visiting has liked your profile
        function findIndexOfUsername(str) {
            var index = str.includes(req.session.user);
            console.log(index);
            console.log("21 "+req.session.user);
            return index
        }
        if(app.locals.likeList != null){
        var userLikesYouCount = findIndexOfUsername(app.locals.likeList);
        console.log("user likes you count ="+ userLikesYouCount)
        }else{
            userLikesYouCount = false
        }
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
if(app.locals.viewedBy != null){
        var viewedCount = findIndexOfUserInViewedBy(app.locals.viewedBy);
}
if(viewedHistory != null){
        var viewedHistoryCount = findIndexOfUserInViewedHistory(viewedHistory);
}
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
       
        // console.log('this is the uname '+req.session.user)
        // schema.user.findOneAndUpdate({ username: app.locals.visiting },
        //     {
        //         $set: {
        //             viewedBy: viewedBy
                    

        //         }
        //     }, async function (err, data) {
        //         if (err) throw err;
               
        //     })
        //     schema.user.findOneAndUpdate({ username: req.session.user },
        //         {
        //             $set: {
                       
        //                 viewedProfileHistory: viewedHistory
    
        //             }
        //         }, async function (err, data) {
        //             if (err) throw err;
                   
        //         })
        //         console.log(" likedBy "+ app.locals.userlikedBy +" like "+req.session.like +" visiting "+req.session.visiting);
        //     var connectedTest1 = app.locals.userlikedBy.includes(req.session.visiting)
        //     var connectedTest2 = req.session.like.includes(req.session.visiting)
        //     console.log("connectedTest1 "+connectedTest1);
        //     console.log("connectedTest2 "+connectedTest2);
        //     if(connectedTest1 == true && connectedTest2 == true){
                var connected = 1;
                
        //     }else{
        //         var connected = 0;
                
        //     }



        res.render('visitProfile', {connected: connected,uname: req.session.user,userLikeYou:app.locals.userLikesYouCount,like: app.locals.likeCount,status: result.status, to: req.session.visiting , photo: result.image, name: result.name, surname: result.surname, username: result.username, age: result.age, gender: result.gender, sp: result.sp, bio: result.bio, dislike: result.dislike, sport: result.sport, fitness: result.fitness, technology: result.technology, music: result.music, gaming: result.gaming, fame: app.locals.fame });
    })})
});

//Display Visiters Gallery
// app.get('/visitingGallery', (req, res) => {
//     schema.user.findOne({ username: app.locals.visiting }, function (err, data) {
//         if (err) throw err;
//         if (data) {
//             app.locals.visitingGallery = data.gallery
//             app.locals.visitingProfilePicture = data.image
//             app.locals.status = data.status
//         }
//         res.render('visitingGallery', { status: app.locals.status, name: req.session.user, gallery: app.locals.visitingGallery, photo: app.locals.visitingProfilePicture });
//     });
// })

module.exports = app;