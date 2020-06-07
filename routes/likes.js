var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
var mysql = require('mysql');
var liked = [];
var likedBy = [];
var visitingliked = [];
var visitinglikedBy = [];
var userliked = [];
var userlikedBy = [];
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'matcha123',
    database: 'Matcha'
});
//like a profile
app.post('/like', urlencodedParser, async (req, res) => {
    app.locals.visiting = req.session.visiting;

    let likeInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
    connection.query(likeInfoSql, async (err, result) => {
        if (result != null) {
            result.forEach(function (result) {
                userliked.push(result.username);
            })
        }
    })
    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    await connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result != null) {
            result.forEach(function (result) {
                userlikedBy.push(result.username)
            })
        }

        function findIndex(str) {
            var index = str.includes(app.locals.visiting);
            return index
        }
        liked = userliked

        if (userliked) {
            var count = findIndex(userliked);
        } else {
            count = false
        }

        if (count == false) {

            liked.push(app.locals.visiting);
            app.locals.count = '0'
            console.log('User Profile liked ')

        }
        else if (count == true) {
            const index = userliked.indexOf(count);

            liked.splice(index, 1);
            console.log(userliked)
            app.locals.count = '-1'
            console.log(app.locals.likeOrNot)
            console.log('User Profile is unliked')

        }
    })

    let updateLiked = `UPDATE liked SET username = '${liked}' WHERE user_id = '${req.session.user_id}'`;
    connection.query(updateLiked, async (err, result) => {
        if (err) throw err;
        console.log('User Profile liked or unliked')
    })
    //add and remove likedBy
    //Get visiting user ID
    let VisitingUserSql = `SELECT * FROM users WHERE username = '${app.locals.visiting}'`;
    connection.query(VisitingUserSql, async (err, result) => {
        if (result != null) {
            result.forEach(function (result) {
                app.locals.visiting_id = result.user_id;
            })
        }

        let likeInfoVisitingUserSql = `SELECT * FROM liked WHERE user_id = '${app.locals.visiting_id}'`;
        connection.query(likeInfoVisitingUserSql, async (err, result) => {
            if (result != null) {
                result.forEach(function (result) {
                    app.locals.visitingliked = result.username;
                })
            }
        })
        let likedByInfoVisitingUserSql = `SELECT * FROM likedBy WHERE user_id = '${app.locals.visiting_id}'`;
        connection.query(likedByInfoVisitingUserSql, async (err, result) => {
            if (err) throw err;
            if (result != null) {
                result.forEach(function (result) {
                    visitinglikedBy.push(result.username)
                })
            }
        })
        function findIndex(str) {
            var index = str.includes(req.session.user);
            return index
        }
        likedBy = visitinglikedBy
        if (visitinglikedBy) {
            var count = findIndex(visitinglikedBy);
        } else {
            var count = false;
            likedBy = [];
        }
        if (count == false) {
            likedBy.push(req.session.user);
            app.locals.count = '0'
            console.log("User Profile is likedBy")
        }
        else if (count == true) {
            const index = visitinglikedBy.indexOf(count);

            likedBy.splice(index, 1);
            console.log(visitinglikedBy)
            app.locals.count = '-1'
            console.log('User Profile is unlikedBy')
        }
        console.log("visiting id = " + app.locals.visiting_id)
        let updateLikedBy = `UPDATE likedBy SET username = '${likedBy}' WHERE user_id = '${app.locals.visiting_id}'`;
        connection.query(updateLikedBy, async (err, result) => {
            if (err) throw err;
            console.log("likedBy or unlikedBy")
            res.redirect('home');
        })
    })
})

app.use(bodyParser.urlencoded({ extended: true }));
app.post('/removeLastViewedBy', async (req, res) => {
    app.locals.viewer = req.body.fname;

    console.log("1 234 " + app.locals.viewer);
    await schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;
        app.locals.viewedBy = data.viewedBy
        var viewedBy = app.locals.viewedBy
        app.locals.viewedLength = app.locals.viewedBy.length
        console.log("test ViewedBy " + viewedBy)
        //add and remove viewedBy
        schema.user.findOne({ username: app.locals.viewer }, async function (err, data) {
            console.log("test user " + req.session.user);
            if (err) throw err;
            function findIndexOfViewedBy(str) {
                var index = str.indexOf(app.locals.viewer);
                console.log(index);
                console.log("2 " + app.locals.viewer);
                return index
            }

            console.log("test ViewedBy " + viewedBy)

            var viewedCount = findIndexOfViewedBy(app.locals.viewedBy);
            //Viewed Profile History

            console.log("count =" + viewedCount)
            console.log("countlength =" + app.locals.viewedLength--)
            //   if (viewedCount == app.locals.viewedLength) {
            const index = app.locals.viewedBy.indexOf(viewedCount);
            viewedBy.splice(index, 1);
            console.log(app.locals.viewedBy)
            app.locals.viewedCount = '-1'
            console.log('User Profile is unviewedBy')
            //   }
            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                        viewedBy: viewedBy,
                    }
                }, async function (err, data) {
                    if (err) throw err;
                    res.redirect('profile-page')

                })
        })
    })
})

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/removeLastViewedHistory', async (req, res) => {
    app.locals.viewer = req.body.fname;

    console.log("1 234 " + app.locals.viewer);
    await schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;
        app.locals.viewedProfiles = data.viewedProfileHistory
        var viewedProfileHistory = data.viewedProfileHistory
        app.locals.viewedProfilesLength = data.viewedProfileHistory.length

        console.log("test ViewedHistory " + viewedProfileHistory)
        //add and remove viewedBy
        schema.user.findOne({ username: app.locals.viewer }, async function (err, data) {
            console.log("test user " + req.session.user);
            if (err) throw err;

            function findIndexOfViewedProfileHistory(str) {
                var index = str.indexOf(app.locals.viewer);
                console.log(index);
                console.log("2 " + app.locals.viewer);
                return index
            }



            //Viewed Profile History
            var viewedProfileHistoryCount = findIndexOfViewedProfileHistory(viewedProfileHistory);
            console.log("count of viewedProfileHistoryCount =" + viewedProfileHistoryCount)
            console.log(" viewedProfilesLength =" + app.locals.viewedProfilesLength--)

            const index = app.locals.viewedProfiles.indexOf(viewedProfileHistoryCount);
            viewedProfileHistory.splice(index, 1);
            app.locals.viewedProfileHistoryCount = '-1'
            console.log('Last User removed from history')

            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                        viewedProfileHistory: viewedProfileHistory
                    }
                }, async function (err, data) {
                    if (err) throw err;
                    res.redirect('profile-page')

                })
        })
    })
})

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

app.get('/viewed', urlencodedParser, (req, res) => {
    app.locals.visiting = req.session.visiting;

    schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;


        //add and remove viewedBy
        schema.user.findOne({ username: app.locals.visiting }, async function (err, data) {

            if (err) throw err;
            function findIndex(str) {
                var index = str.indexOf(req.session.user);
                console.log(index);
                return index
            }
            app.locals.viewedBy = data.viewedBy
            var viewedBy = app.locals.viewedBy

            var viewedCount = findIndex(app.locals.viewedBy);
            if (viewedCount == '-1') {
                viewedBy.push(req.session.user);
                console.log('User Profile viewewdBy')
                app.locals.viewedCount = '0'
            }
            schema.user.findOneAndUpdate({ username: app.locals.visiting },
                {
                    $set: {
                        viewedBy: viewedBy
                    }
                }, async function (err, data) {
                    if (err) throw err;

                })
        })
    })
    res.off();
})

//block a profile
app.post('/dislike', urlencodedParser, (req, res) => {
    schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;
        app.locals.visiting = req.session.visiting;
        function findIndex(str) {
            var index = str.indexOf(app.locals.visiting);
            return index
        }
        var str
        if (data.blocked) {
            app.locals.blocked = data.blocked;
            str = app.locals.blocked
            var count = findIndex(app.locals.blocked);
            if (count == '-1') {
                str.push(app.locals.visiting);
                console.log('User Profile blocked')
            }
            else {
                const index = app.locals.blocked.indexOf(count);
                app.locals.blocked.splice(index, 1);
                console.log('User Profile is unblocked')
            }
        }
        else {
            str.push(app.locals.visiting);
            console.log('User Profile blocked')
        }
        schema.user.findOneAndUpdate({ username: req.session.user },
            {
                $set: {
                    blocked: str
                }
            }, async function (err, data) {
                if (err) throw err;

                res.redirect('home');
            })
    })
})

module.exports = app;