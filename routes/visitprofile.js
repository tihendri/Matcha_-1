var express = require('express');
var app = express();
const session = require('express-session');
var mysql = require('mysql');
var visitingUserObject = {};
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});
//View another persons Page
app.get('/visitProfile', async (req, res) => {
    console.log(req.session.user);

    //For logged in user to get Table data
    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if(result != null){
        result.forEach(function (result) {
            req.session.like = result.username;
            console.log("liked History1 " + req.session.like)
            // userArray.push(result.image);
        })
    }
    })
    let viewedInfoSql = `SELECT * FROM viewed WHERE user_id = '${req.session.user}'`;
    connection.query(viewedInfoSql, async (err, result) => {
        if(result != null){
        result.forEach(function (result) {
            console.log(result.username)

            app.locals.viewed = result.username;
            // userArray.push(result.image);
        })
    }
    })
    let likedByInfoSql = `SELECT * FROM likedby WHERE user_id = '${req.session.user}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if(result != null){
        result.forEach(function (result) {
            console.log(result.username)

            app.locals.userlikedBy = result.username
            console.log("userlikedBy 1 " + app.locals.userlikedBy)
            // userArray.push(result.image);
        })
    }
    })
    let viewedProfileHistoryInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user}'`;
    connection.query(viewedProfileHistoryInfoSql, async (err, result) => {
        if(result != null){
        result.forEach(function (result) {
            console.log(result.username)

            req.session.viewedHistory = result.viewedProfileHistory
            console.log("viewed History " + req.session.viewedHistory)
            // userArray.push(result.image);
        })
    }
    })
    //  await schema.user.findOne({ username: req.session.user }, function (err, data) {

    var user = req.query.user.toString();
    req.session.visiting = user
    var visitingInfo = [];
    let visitinUserInfoSql = `SELECT * FROM users WHERE username = '${user}'`;
    connection.query(visitinUserInfoSql, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {
            app.locals.visitingUser_id = result.user_id
            visitingUserObject.user_id = result.user_id;
            visitingUserObject.status = result.status;
            visitingUserObject.fitness = result.fitness;
            visitingUserObject.gaming = result.gaming;
            visitingUserObject.music = result.music;
            visitingUserObject.name = result.name;
            visitingUserObject.surname = result.surname;
            visitingUserObject.username = result.username;
            visitingUserObject.age = result.age;
            visitingUserObject.gender = result.gender;
            visitingUserObject.fame = result.fame;
            visitingUserObject.bio = result.bio;
            visitingUserObject.technology = result.technology;

            console.log(app.locals.visitingUser_id);
            console.log(app.locals.status);
            // app.locals.likedBy = result.likedBy
            // app.locals.viewedBy = result.viewedBy
            console.log(app.locals.visitingUser);
            app.locals.visitingUser = result.username
            req.session.visiting = app.locals.visitingUser
            // app.locals.likeList = result.like;
            // userArray.push(result.image);
        })

        //To get Table data for visiting user
        let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(likeInfoSql, async (err, result) => {
            if(result != null){
            result.forEach(function (result) {
                req.session.like = result.username;
                console.log("liked History1 " + req.session.like)
                // userArray.push(result.image);
            })
        }
        })
        let viewedInfoSql = `SELECT * FROM viewed WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(viewedInfoSql, async (err, result) => {
            if(result != null){
            result.forEach(function (result) {
                console.log(result.username)

                app.locals.viewed = result.username;
                // userArray.push(result.image);
            })
        }
        })
        let likedByInfoSql = `SELECT * FROM likedby WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(likedByInfoSql, async (err, result) => {
            if(result != null){
            result.forEach(function (result) {
                console.log(result.username)

                app.locals.userlikedBy = result.username
                console.log("userlikedBy 1 " + app.locals.userlikedBy)
                // userArray.push(result.image);
            })
        }
        })
        console.log("visiting user = " + app.locals.visitingUser)
        // schema.user.findOne({ username: user }, function (err, data) {
        // app.locals.fame = result.likedBy.length


        console.log("visitingUser app.locals " + req.session.visiting)
        function findIndex(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        console.log("like app.locals " + req.session.like)
        if (req.session.like) {
            var count = findIndex(req.session.like);
            console.log("like count " + count)
        }
        if (count == true) {
            app.locals.likeCount = '0'
        }
        else if (count == false) {
            app.locals.likeCount = '-1'
        }else{
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
            console.log("21 " + req.session.user);
            return index
        }
        if (app.locals.likeList != null) {
            var userLikesYouCount = findIndexOfUsername(app.locals.likeList);
            console.log("user likes you count =" + userLikesYouCount)
        } else {
            userLikesYouCount = false
        }
        if (err) throw err;
        if (userLikesYouCount == false) {
            app.locals.userLikesYouCount = 0;
        }
        else if (userLikesYouCount == true) {
            app.locals.userLikesYouCount = 1;
        }
        console.log("like value " + app.locals.likeCount)
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
        console.log("This is the viewedHistory = " + viewedHistory)
        console.log("This is the visiting user = " + req.session.visiting)
        if (app.locals.viewedBy != null) {
            var viewedCount = findIndexOfUserInViewedBy(app.locals.viewedBy);
        }
        if (viewedHistory != null) {
            var viewedHistoryCount = findIndexOfUserInViewedHistory(viewedHistory);
        }
        console.log("This is viewedHistoryCount = " + viewedHistoryCount)
        console.log("This is iewedCount = " + viewedCount)
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



        res.render('visitProfile', { connected: connected, uname: req.session.user, userLikeYou: app.locals.userLikesYouCount, like: app.locals.likeCount, status: visitingUserObject.status, to: req.session.visiting, photo: visitingUserObject.image, name: visitingUserObject.name, surname: visitingUserObject.surname, username: visitingUserObject.username, age: visitingUserObject.age, gender: visitingUserObject.gender, sp: visitingUserObject.sp, bio: visitingUserObject.bio, dislike: visitingUserObject.dislike, sport: visitingUserObject.sport, fitness: visitingUserObject.fitness, technology: visitingUserObject.technology, music: visitingUserObject.music, gaming: visitingUserObject.gaming, fame: app.locals.fame });
    })
})


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
