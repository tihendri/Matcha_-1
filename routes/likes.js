var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
var config = require('../config.js')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const connection = config.connection;

var liked, userLiked;
var visitinglikedBy;
var userlikedBy, likedBy;
var likedByCount, count;

//------------------------------------like a profile----------------------------------------
app.post('/like', urlencodedParser, async (req, res) => {
    app.locals.visiting = req.session.visiting;

    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if (result != null) {
            result.forEach(function (result) {
                userLiked = result.username;
                console.log("userliked == " + userLiked);
            })
        }
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userlikedBy = result.username
            })
        }
        function findIndexOfUsernameInUserLiked(str) {
            var index = str.includes(app.locals.visiting);
            return index
        }

        if (userLiked) {
            count = findIndexOfUsernameInUserLiked(userLiked);
        } else {
            count = false
            userLiked = '';
        }
        //ADD Username to liked string
        if (count == false) {
            liked = userLiked + ',' + app.locals.visiting
            app.locals.count = '0'
            console.log('User Profile liked ')
        }
        //REMOVE Username from liked string
        else if (count == true) {
            liked = userLiked.replace(',' + app.locals.visiting, '')
            app.locals.count = '-1'
            console.log(app.locals.likeOrNot)
            console.log('User Profile is unliked')
        }

        let updateLiked = `UPDATE liked SET username = '${liked}' WHERE user_id = '${req.session.user_id}'`;
        connection.query(updateLiked, async (err, result) => {
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
            }
            let likedByInfoVisitingUserSql = `SELECT * FROM likedBy WHERE user_id = '${app.locals.visiting_id}'`;
            connection.query(likedByInfoVisitingUserSql, async (err, result) => {
                if (err) throw err;
                if (result != null) {
                    result.forEach(function (result) {
                        visitinglikedBy = result.username
                    })
                }
            })
            function findIndexOfUsernameInLikedBy(str) {
                var index = str.includes(req.session.user);
                return index
            }
            if (visitinglikedBy) {
                likedByCount = findIndexOfUsernameInLikedBy(visitinglikedBy);
            } else {
                likedByCount = false;
                visitinglikedBy = '';
            }
            if (likedByCount == false) {
                likedBy = visitinglikedBy + ',' + req.session.user
                app.locals.count = '0'
                console.log("User Profile is likedBy")
            }
            else if (likedByCount == true) {
                likedBy = visitinglikedBy.replace(',' + req.session.user, '')
                app.locals.count = '-1'
                console.log('User Profile is unlikedBy')
            }
            let updateLikedBy = `UPDATE likedBy SET username = '${likedBy}' WHERE user_id = '${app.locals.visiting_id}'`;
            connection.query(updateLikedBy, async (err, result) => {
                if (err) throw err;
                console.log("likedBy or unlikedBy")
                res.redirect('visitProfile');
            })
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


// //like viewer page
// app.post('/like', urlencodedParser, (req, res) => {
//     app.locals.visiting = req.session.viewer;
//     console.log("hello "+app.locals.visiting)
//     schema.user.findOne({ username: req.session.user }, async function (err, data) {
//         if (err) throw err;
//         function findIndex(str) {
//             var index = str.indexOf(app.locals.visiting);
//             return index
//         }
//         app.locals.liked = data.like;
//         app.locals.likedBy = data.likedBy
//         var liked = app.locals.liked

//         var count = findIndex(app.locals.liked);

//         if (count == '-1') {
//             liked.push(app.locals.visiting);
//             console.log('User Profile liked')
//             app.locals.count = '0'
//         }
//         else if (count == '0') {
//             const index = app.locals.liked.indexOf(count);

//             liked.splice(index, 1);
//             req.session.user.spl
//             console.log(app.locals.liked)
//             app.locals.count = '-1'
//             console.log(app.locals.likeOrNot)
//             console.log('User Profile is unliked')
//         }
//         schema.user.findOneAndUpdate({ username: req.session.user },
//             {
//                 $set: {
//                     like: liked
//                 }
//             }, function (err, data) {
//                 if (err) throw err;
//             }).then(() => {})

//         //add and remove likedBy
//         schema.user.findOne({ username: app.locals.visiting }, async function (err, data) {
//             if (err) throw err;
//             function findIndex(str) {
//                 var index = str.indexOf(req.session.user);
//                 console.log(index);
//                 return index
//             }
//             app.locals.liked = data.like;
//             app.locals.likedBy = data.likedBy
//             var likedBy = app.locals.likedBy

//             var count = findIndex(app.locals.likedBy);
//             if (count == '-1') {
//                 likedBy.push(req.session.user);
//                 console.log('User Profile likedBy')
//                 app.locals.count = '0'
//             }
//             else if (count == '0') {
//                 const index = app.locals.likedBy.indexOf(count);

//                 likedBy.splice(index, 1);
//                 console.log(app.locals.likedBy)
//                 app.locals.count = '-1'
//                 console.log('User Profile is unlikedBy')
//             }
//             schema.user.findOneAndUpdate({ username: app.locals.visiting },
//                 {
//                     $set: {
//                         likedBy: likedBy
//                     }
//                 }, async function (err, data) {
//                     if (err) throw err;
//                     res.redirect('home');
//                 })
//         })
//     })
// })


// app.get('/viewed', urlencodedParser, (req, res) => {
//     app.locals.visiting = req.session.visiting;

//      schema.user.findOne({ username: req.session.user }, async function (err, data) {
//          if (err) throw err;


//         //add and remove viewedBy
//         //schema.user.findOne({ username: app.locals.visiting }, async function (err, data) {
//             var arrayviewedProfiles;
//             let viewedProfilesInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user_id}'`;
//             connection.query(viewedProfilesInfoSql, async (err, result) => {
//                 if (err) throw err;
//                 if (result) {
//                     result.forEach(function (result) {
//                         app.locals.viewedProfiles = result.username
//                     })
//                     arrayviewedProfiles = app.locals.viewedProfiles.split(',')
//                 }
//             if (err) throw err;
//             function findIndex(str) {
//                 var index = str.indexOf(req.session.user);
//                 console.log(index);
//                 return index
//             }
//             app.locals.viewedBy = data.viewedBy
//             var viewedBy = app.locals.viewedBy

//             var viewedCount = findIndex(app.locals.viewedBy);
//             if (viewedCount == '-1') {
//                 viewedBy.push(req.session.user);
//                 console.log('User Profile viewewdBy')
//                 app.locals.viewedCount = '0'
//             }
//             schema.user.findOneAndUpdate({ username: app.locals.visiting },
//                 {
//                     $set: {
//                         viewedBy: viewedBy
//                     }
//                 }, async function (err, data) {
//                     if (err) throw err;

//                 })
//         })
//     })
//     res.off();
// })

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
            blockedUsers = app.locals.blocked.replace(','+req.session.visiting, '')
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

module.exports = app;