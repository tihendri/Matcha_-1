var express = require('express');
var app = express();
const session = require('express-session');
var mysql = require('mysql');
var visitingUserObject = {};
var userViewedHistory, viewedHistory;
var userLikedBy;
var userLiked;
var visitingLiked;
var userLikesYouCount, count, viewedCount, viewedHistoryCount;
var vistingViewedBy, viewedBy;
var connectedTest1, connectedTest2

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});
//View another persons Page
app.get('/visitProfile', async (req, res) => {

//----------------------------------For logged in user to get Table data-------------------------------------------

//-----------------------------------Start-------------------------------------------

    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userLiked = result.username
            })
        }
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userLikedBy = result.username
            })
        }
    })
    let viewedProfileHistoryInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user}'`;
    connection.query(viewedProfileHistoryInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userViewedHistory = result.username
            })
        }
    })

//-------------------------------END OF TABLE SET----------------------------------------
    
//-------------------Get visiting user info and set a object with the data-------------------------
    var user = req.query.user.toString();
    req.session.visiting = user
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
            visitingUserObject.technology = result.technology;
            visitingUserObject.name = result.name;
            visitingUserObject.surname = result.surname;
            visitingUserObject.username = result.username;
            visitingUserObject.age = result.age;
            visitingUserObject.gender = result.gender;
            visitingUserObject.fame = result.fame;
            visitingUserObject.bio = result.bio;
            app.locals.visitingUser = result.username
            req.session.visiting = app.locals.visitingUser
        })

//---------------------------------To get Table data for visiting user---------------------

//-----------------------------------------------START----------------------------------------------

        let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(likeInfoSql, async (err, result) => {
            if (err) throw err;
            if (result != null) {
                result.forEach(function (result) {
                    visitingLiked = result.username;
                })
            }
        })
        let viewedByInfoSql = `SELECT * FROM viewedBy WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(viewedByInfoSql, async (err, result) => {
            if (err) throw err;
            if (result != null) {
                result.forEach(function (result) {
                    vistingViewedBy = result.username;
                })
            }
        })
//---------------------------------END OF TABLE SET---------------------------

        console.log("visitingUser " + req.session.visiting)
        function findIndex(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        if (userLiked) {
            count = findIndex(userLiked);
        } else {
            count = false
        }
        if (count == true) {
            app.locals.likeCount = '0'
        }
        else if (count == false) {
            app.locals.likeCount = '-1'
        }

        //Check if the user you are visiting has liked your profile
        function findIndexOfUsername(str) {
            var index = str.includes(req.session.user);
            return index
        }
        if (visitingLiked) {
            userLikesYouCount = findIndexOfUsername(visitingLiked);
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

//--------------------------------ADD logged in user to viewedBy-------------------------- 

        function findIndexOfUserInViewedBy(str) {
            var index = str.includes(req.session.user);
            console.log(index);
            return index
        }
        if (vistingViewedBy) {
            viewedCount = findIndexOfUserInViewedBy(vistingViewedBy);
        } else {
            viewedCount = false;
            vistingViewedBy = '';
        }
        if (viewedCount == false) {
            viewedBy = vistingViewedBy + ',' + req.session.user;
            console.log('ADDED logged in user to viewedBy')
        }
        let updateViewedBy = `UPDATE viewedBy SET username = '${viewedBy}' WHERE user_id = '${visitingUserObject.user_id}'`;
        connection.query(updateViewedBy, async (err, result) => {
            if (err) throw err;
        })
//---------------------------------------------ADD viewedBy DONE------------------------------------------

//---------------------------------------------ADD ViewedHistory------------------------------------------

        function findIndexOfUserInViewedHistory(str) {
            var index = str.includes(req.session.visiting);
            console.log(index);
            return index
        }
        if (userViewedHistory) {
            viewedHistoryCount = findIndexOfUserInViewedHistory(userViewedHistory);
        } else {
            viewedHistoryCount = false;
            userViewedHistory = '';
        }
        if (viewedHistoryCount == false) {
            viewedHistory = userViewedHistory + ',' + req.session.visiting;
            console.log('ADDED user you are visiting to viewedProfileHistory')
        }
        let updateviewedProfileHistory = `UPDATE viewedProfileHistory SET username = '${viewedHistory}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateviewedProfileHistory, async (err, result) => {
            if (err) throw err;
        })
//---------------------------------------------ADD ViewedHistory DONE------------------------------------------

//---------------------------------Check if BOTH users have liked each other--------------------------------------------------
        if (userLikedBy) {
            connectedTest1 = userLikedBy.includes(req.session.visiting)
        }
        else {
            connectedTest1 = false
        }
        if (userLiked) {
            connectedTest2 = userLiked.includes(req.session.visiting)
        } else {
            connectedTest2 = false;
        }
        if (connectedTest1 == true && connectedTest2 == true) {
            var connected = 1;

        } else {
            var connected = 0;
        }
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
