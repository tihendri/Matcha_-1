var express = require('express');
var app = express();
// const schema = require('../models/User');
const bodyParser = require('body-parser');
var config = require('../config.js')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const connection = config.connection;

var liked, userLiked;
var visitinglikedBy;
var loggedInUsername;
var userlikedBy, likedBy;
var likedByCount, count, loggedInUsernameInUserLikedCount, visitingUsernameInUserLikedByCount;

//------------------------------------like a profile----------------------------------------
app.post('/like', urlencodedParser, async (req, res) => {
    app.locals.visiting = req.session.visiting;
    var userlikedValue;
    let loggedInUserInfoSql = `SELECT * FROM users WHERE user_id= '${req.session.user_id}'`;
    connection.query(loggedInUserInfoSql, async (err, result) => {
        if (result != null) {
            result.forEach(function (result) {
                loggedInUsername = result.username;
            })
        }
    })
    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if (result != null) {
            result.forEach(function (result) {
                userLiked = result.username;
                console.log("userliked == " + userLiked);
            })
        }
    })
    let userlikedInfoSql = `SELECT liked FROM users WHERE user_id = '${req.session.user_id}'`;
    connection.query(userlikedInfoSql, async (err, result) => {
        if (result != null) {
            userlikedValue = 0;
            result.forEach(function (result) {
                userlikedValue = result.liked;
                console.log("liked == " + liked);
            })
        }
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        userlikedBy = [];
        if (result != null) {
            result.forEach(function (result) {
                userlikedBy = result.username
            })
        }
        function findIndexOfLoggedInUsernameInLikedBy(str) {
            var index = str.includes(req.session.user);
            return index
        }
        function findIndexOfVisitingUsernameInUserLiked(str) {
            var index = str.includes(app.locals.visiting);
            return index
        }

        if (userLiked) {
            count = findIndexOfVisitingUsernameInUserLiked(userLiked);
            loggedInUsernameInUserLikedCount = findIndexOfLoggedInUsernameInLikedBy(userLiked);
        } else {
            count = false
            userLiked = '';
        }

        //ADD Username to liked string
        if (count == false) {
            liked = userLiked + ',' + app.locals.visiting
            app.locals.count = '0'
            console.log('User Profile liked ')
            userlikedValue++;
        }
        //REMOVE Username from liked string
        else if (count == true) {
            liked = userLiked.replace(',' + app.locals.visiting, '')
            app.locals.count = '-1'
            if (userlikedValue > 0) {
                userlikedValue--
            }
            console.log(app.locals.likeOrNot)
            console.log('User Profile is unliked')
        }
        if (loggedInUsernameInUserLikedCount == true) {
            console.log("loggedInUsernameInUserLikedCount = " + loggedInUsernameInUserLikedCount)
            liked = userLiked.replace(',' + req.session.user, '')
        }

        let updateLiked = `UPDATE liked SET username = '${liked}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateLiked, async (err, result) => {
            if (err) throw err;
            console.log('User Profile liked or unliked')
        })
        let updateUserLiked = `UPDATE users SET liked = '${userlikedValue}' WHERE username = '${app.locals.visiting}'`;
        connection.query(updateUserLiked, async (err, result) => {
            if (err) throw err;
            console.log('User Profile liked or unliked')
        })
        //--------------------------------------LIKED/UNLIKED DONE-----------------------------

        //--------------------------------------ADD or REMOVE likedBy--------------------------
        //Get visiting user ID
        let VisitingUserSql = `SELECT * FROM users WHERE username = '${app.locals.visiting}'`;
        connection.query(VisitingUserSql, async (err, result) => {
            if (result != null) {
                result.forEach(function (result) {
                    app.locals.visiting_id = result.user_id;
                })

                let likedByInfoVisitingUserSql = `SELECT * FROM likedBy WHERE user_id = '${app.locals.visiting_id}'`;
                connection.query(likedByInfoVisitingUserSql, async (err, result) => {
                    if (err) throw err;
                    visitinglikedBy = [];
                    if (result != null) {
                        result.forEach(function (result) {
                            visitinglikedBy = result.username
                            console.log("AWEEE  visitinglikedBy== " + result.username)
                        })

                        if (visitinglikedBy) {
                            function findLikedBy(str) {
                                var index = str.includes(req.session.user);
                                return index
                            }
                            likedByCount = findLikedBy(visitinglikedBy);
                            visitingUsernameInUserLikedByCount = findIndexOfVisitingUsernameInUserLiked(visitinglikedBy);
                            console.log("likedByCount == " + likedByCount)
                            console.log("visitingUsernameInUserLikedByCount == " + visitingUsernameInUserLikedByCount)
                        } else {
                            likedByCount = false;
                            visitinglikedBy = '';
                        }
                        if (likedByCount == false) {
                            likedBy = [];
                            likedBy = visitinglikedBy + ',' + req.session.user
                            app.locals.count = '0'
                            console.log("User Profile is likedBy")
                        }
                        else if (likedByCount == true) {
                            likedBy = [];
                            likedBy = visitinglikedBy.replace(',' + req.session.user, '')
                            app.locals.count = '-1'
                            console.log('User Profile is unlikedBy')
                        }
                        if (visitingUsernameInUserLikedByCount == true) {
                            console.log(" visitingUsernameInUserLikedByCount = " + visitingUsernameInUserLikedByCount)
                            likedBy = visitinglikedBy.replace(',' + req.session.user, '')
                        }
                        console.log("loggedInUsername == " + req.session.user)
                        let updateLikedBy = `UPDATE likedBy SET username = '${likedBy}' WHERE user_id = '${app.locals.visiting_id}'`;
                        connection.query(updateLikedBy, async (err, result) => {
                            if (err) throw err;
                            console.log("likedBy or unlikedBy")
                            res.redirect('visitProfile');
                        })
                    }
                })

            }
            //----------------------------------------------ADD or REMOVE likedBy DONE--------------------------
        })
    })

})

//-------------------------------------------------removeLastViewedBy----------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/removeLastViewedBy', async (req, res) => {
    app.locals.viewer = req.body.fname;
    var viewedByUpdate;
    var arrayViewedBy
    let viewedByInfoSql = `SELECT * FROM viewedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(viewedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                app.locals.viewedBy = result.username
            })
            arrayViewedBy = app.locals.viewedBy.split(',')
            app.locals.viewedLength = arrayViewedBy.length
        }
        viewedByUpdate = app.locals.viewedBy.replace(',' + app.locals.viewer, '')
        app.locals.viewedCount = '-1'
        let updateviewedBy = `UPDATE viewedBy SET username = '${viewedByUpdate}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateviewedBy, async (err, result) => {
            if (err) throw err;
            console.log('User Profile is unviewedBy')
            res.redirect('profile-page')
        });
    })
})
//--------------------------------------END------------------------------------------------

//------------------------------removeLastViewedHistory---------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/removeLastViewedHistory', async (req, res) => {
    app.locals.viewer = req.body.fname;
    var viewedProfilesUpdate;
    var arrayviewedProfiles;
    let viewedProfilesInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user_id}'`;
    connection.query(viewedProfilesInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                app.locals.viewedProfiles = result.username
            })
            arrayviewedProfiles = app.locals.viewedProfiles.split(',')
        }
        viewedProfilesUpdate = app.locals.viewedProfiles.replace(',' + app.locals.viewer, '')
        app.locals.viewedProfileHistoryCount = '-1'
        let updateViewedProfiles = `UPDATE viewedProfileHistory SET username = '${viewedProfilesUpdate}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateViewedProfiles, async (err, result) => {
            if (err) throw err;
            console.log('viewedProfiles Updated')
            res.redirect('profile-page')
        });
    })
})
//----------------------------------------------END------------------------------------------
//-------------------------------------------BLOCK a User-----------------------------------------------
//block a profile
app.post('/dislike', urlencodedParser, (req, res) => {
    //schema.user.findOne({ username: req.session.user }, async function (err, data) {
    // if (err) throw err;
    var blockedUserCount
    var blockedUsers
    let blockedUsersInfoSql = `SELECT * FROM blocked WHERE user_id = '${req.session.user_id}'`
    connection.query(blockedUsersInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                app.locals.blocked = result.username
            })
        }
        function findIndexOfLoggedInUserInBlockedUsers(str) {
            var index = str.includes(req.session.visiting);
            return index
        }
        if (app.locals.blocked) {
            blockedUserCount = findIndexOfLoggedInUserInBlockedUsers(app.locals.blocked);

        } else {
            blockedUserCount = false;
            app.locals.blocked = '';
        }
        if (blockedUserCount == false) {
            blockedUsers = app.locals.blocked + ',' + req.session.visiting
            console.log('User Profile blocked')
        }
        else if (blockedUserCount == true) {
            blockedUsers = app.locals.blocked.replace(',' + req.session.visiting, '')
            console.log('User Profile is unblocked')
        }
        let updateBlockedUsers = `UPDATE blocked SET username = '${blockedUsers}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateBlockedUsers, async (err, result) => {
            if (err) throw err;
            console.log('blocked Users Updated')
            res.redirect('home');
        });
    })
})
//------------------------------------------------__END__---------------------------------------

module.exports = app;