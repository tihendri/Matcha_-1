var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//like a profile
app.post('/like', urlencodedParser, (req, res) => {
    console.log(app.locals.visiting)
    schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;
        function findIndex(str) {
            var index = str.indexOf(app.locals.visiting);
            return index
        }
        app.locals.liked = data.like;
        app.locals.likedBy = data.likedBy
        var liked = app.locals.liked

        var count = findIndex(app.locals.liked);

        if (count == '-1') {
            liked.push(app.locals.visiting);
            console.log('User Profile liked')
            app.locals.count = '0'
        }
        else if (count == '0') {
            const index = app.locals.liked.indexOf(count);

            liked.splice(index, 1);

            req.session.user.spl
            console.log(app.locals.liked)
            app.locals.count = '-1'
            console.log(app.locals.likeOrNot)
            console.log('User Profile is unliked')
        }
        schema.user.findOneAndUpdate({ username: req.session.user },
            {
                $set: {
                    like: liked
                }
            }, async function (err, data) {
                if (err) throw err;
            })

        //add and remove likedBy
        schema.user.findOne({ username: app.locals.visiting }, async function (err, data) {
            if (err) throw err;
            function findIndex(str) {
                var index = str.indexOf(req.session.user);
                console.log(index);
                return index
            }
            app.locals.liked = data.like;
            app.locals.likedBy = data.likedBy
            var likedBy = app.locals.likedBy

            var count = findIndex(app.locals.likedBy);
            if (count == '-1') {
                likedBy.push(req.session.user);
                console.log('User Profile likedBy')
                app.locals.count = '0'
            }
            else if (count == '0') {
                const index = app.locals.likedBy.indexOf(count);

                app.locals.likedBy.splice(index, 1);
                console.log(app.locals.likedBy)
                app.locals.count = '-1'
                console.log('User Profile is unlikedBy')
            }
            schema.user.findOneAndUpdate({ username: app.locals.visiting },
                {
                    $set: {
                        likedBy: likedBy
                    }
                }, async function (err, data) {
                    if (err) throw err;
                    res.redirect('home');
                })
        })
    })
})
//block a profile
app.post('/dislike', urlencodedParser, (req, res) => {
    schema.user.findOne({ username: req.session.user }, async function (err, data) {
        if (err) throw err;

        function findIndex(str) {
            var index = str.indexOf(app.locals.visiting);
            return index
        }
        app.locals.blocked = data.blocked;
        var str = app.locals.blocked

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