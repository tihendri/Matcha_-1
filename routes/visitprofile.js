var express = require('express');
var app = express();
const session = require('express-session');
var config = require('../config.js');
const { forEach } = require('async');
const connection = config.connection;
var visitingUserObject = {};
var userViewedHistory, viewedHistory;
var userLikedBy;
var userBlocked;
var userLiked;
var visitingLiked;
var userLikesYouCount, count, viewedCount, viewedHistoryCount, blockedCount, viewedByLoggedInUserCount, viewedHistoryLoggedInUserCount;
var vistingViewedBy, viewedBy;
var connectedTest1, connectedTest2
var user

//View another persons Page
app.get('/visitProfile', async (req, res) => {
    if(req.session.user == undefined){
        res.redirect('/')
    }
    console.log("Session user == " + req.session.user)

    //----------------------------------For logged in user to get Table data-------------------------------------------

    //-----------------------------------Start-------------------------------------------

    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userLiked = result.username
            })
        }
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userLikedBy = result.username
            })
        }
    })
    let blockedInfoSql = `SELECT * FROM blocked WHERE user_id = '${req.session.user_id}'`;
    connection.query(blockedInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userBlocked = result.username
            })
        }
    })


    //-------------------------------END OF TABLE SET----------------------------------------

    //-------------------Get visiting user info and set a object with the data-------------------------
    if (req.query.user) {

        user = req.query.user.toString();
        req.session.visiting = user
    } else {
        user = req.session.visiting
    }
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
            visitingUserObject.sport = result.sport;
            visitingUserObject.name = result.name;
            visitingUserObject.surname = result.surname;
            visitingUserObject.username = result.username;
            visitingUserObject.age = result.age;
            visitingUserObject.gender = result.gender;
            visitingUserObject.bio = result.bio;
            visitingUserObject.image = result.image;
            visitingUserObject.fameRating = result.liked;
            req.session.visiting = result.username

        })
        // let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${app.locals.visitingUser_id}'`;
        // connection.query(likedByInfoSql, async (err, result) => {
        //     if (err) throw err;
        //     if (result) {
        //         result.forEach(function (result) {
        //             if (result.username) {
        //                 visitingUserObject.fameRating = ((result.username.split(',').length) - 1)
        //             }
        //         })
        //     }
        // });
        //---------------------------------To get Table data for visiting user---------------------

        //-----------------------------------------------START----------------------------------------------

        let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(likeInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    visitingLiked = result.username;
                })
            }
        })

        //---------------------------------END OF TABLE SET---------------------------
        //Check if Logged In user has liked the Visiting user
        function findIndexOfUserInLiked(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        if (userLiked) {
            count = findIndexOfUserInLiked(userLiked);
        } else {
            count = false
        }
        if (count == true) {
            app.locals.likeCount = '0'
        }
        else if (count == false) {
            app.locals.likeCount = '-1'
        }

        //Check if Logged In user has blocked the Visiting user
        function findIndexOfUserInBlocked(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        if (userBlocked) {
            blockedCount = findIndexOfUserInBlocked(userBlocked);
            console.log("this is the blockedCount == " + blockedCount)
        } else {
            blockedCount = false
        }
        if (blockedCount == true) {
            app.locals.blockedCount = '0'
        }
        else if (blockedCount == false) {
            app.locals.blockedCount = '-1'
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
        let viewedByInfoSql = `SELECT * FROM viewedBy WHERE user_id = '${app.locals.visitingUser_id}'`;
        connection.query(viewedByInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                vistingViewedBy = null
                result.forEach(function (result) {
                    vistingViewedBy = result.username;

                    console.log("vistingViewedBy == " + result.username)

                })

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
                if (viewedCount == true) {
                    viewedBy = vistingViewedBy.replace(',' + req.session.user, '')
                }

                if (viewedCount == false) {
                    viewedBy = vistingViewedBy + ',' + req.session.user;
                    console.log('ADDED logged in user to viewedBy')
                }
                if (viewedBy) {
                    let updateViewedBy = `UPDATE viewedBy SET username = '${viewedBy}' WHERE user_id = '${visitingUserObject.user_id}'`;
                    connection.query(updateViewedBy, async (err, result) => {
                        if (err) throw err;
                    })
                }
            }
        })
        //---------------------------------------------ADD viewedBy DONE------------------------------------------

        //---------------------------------------------ADD ViewedHistory------------------------------------------

        let viewedProfileHistoryInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user_id}'`;
        connection.query(viewedProfileHistoryInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                userViewedHistory = null
                result.forEach(function (result) {
                    userViewedHistory = result.username
                    console.log("userViewedHistory == " + result.username)
                })

                function findIndexOfUserInViewedHistory(str) {
                    var index = str.includes(req.session.visiting) || str.includes(req.session.user);
                    console.log(index);
                    return index
                }

                if (userViewedHistory) {
                    viewedHistoryCount = findIndexOfUserInViewedHistory(userViewedHistory);
                } else {
                    viewedHistoryCount = false;
                    userViewedHistory = '';
                }
                // if (viewedHistoryLoggedInUserCount == true) {
                //     viewedHistory = userViewedHistory.replace(',' + req.session.user, '')
                // }


                if (viewedHistoryCount == false) {
                    if (req.session.visiting != "undefined") {

                        console.log("req.session.visiting == " + req.session.visiting)
                        console.log("userViewedHistory  == " + userViewedHistory)
                        if (req.session.visiting != req.session.user) {
                            viewedHistory = userViewedHistory + ',' + req.session.visiting;
                            console.log('ADDED user you are visiting to viewedProfileHistory')
                        }
                    }
                }
                if (viewedHistory) {
                    let updateviewedProfileHistory = `UPDATE viewedProfileHistory SET username = '${viewedHistory}' WHERE user_id = '${req.session.user_id}'`;
                    connection.query(updateviewedProfileHistory, async (err, result) => {
                        if (err) throw err;
                    })
                }
            }
        })
        //---------------------------------------------ADD ViewedHistory DONE------------------------------------------

        //---------------------------------Check if BOTH users have liked each other--------------------------------------------------
        connectedTest1 = false;
        connectedTest2 = false;
        console.log("userLikedBy == " + userLikedBy)
        console.log(" userLiked == " + userLiked)
        console.log("req.session.visiting == " + req.session.visiting)
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
            connected = 1;

        } else {
            connected = 0;
        }
        // console.log("connected == "+connected)
        // console.log("userLikedBy == "+userLikedBy)
        // console.log(" userLiked == "+ userLiked)
        // console.log("This is the logged in user == "+req.session.user);


        res.render('visitProfile', { connected: connected, uname: req.session.user, userLikeYou: app.locals.userLikesYouCount, like: app.locals.likeCount, blocked: app.locals.blockedCount, status: visitingUserObject.status, to: req.session.visiting, photo: visitingUserObject.image, name: visitingUserObject.name, surname: visitingUserObject.surname, username: visitingUserObject.username, age: visitingUserObject.age, gender: visitingUserObject.gender, sp: visitingUserObject.sp, bio: visitingUserObject.bio, dislike: visitingUserObject.dislike, sport: visitingUserObject.sport, fitness: visitingUserObject.fitness, technology: visitingUserObject.technology, music: visitingUserObject.music, gaming: visitingUserObject.gaming, fame: visitingUserObject.fameRating });
    })
})
module.exports = app;
