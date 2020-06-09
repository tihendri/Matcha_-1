var express = require('express');
var app = express();
var config = require('../config.js')
const connection = config.connection;

//Users you can chat to
app.get('/chatList', (req, res) => {
    var userObject = {};
    var arrayLiked = [];
    var arrayLikedBy = [];


    let likedByInfoSql = `SELECT * FROM likedBy WHERE user_id = '${req.session.user_id}'`;
    connection.query(likedByInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                userObject.likedBy = result.username
            })
            arrayLikedBy = userObject.likedBy.split(",")
        }
        let likedInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
        connection.query(likedInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    userObject.liked = result.username
                })
                userObject.liked = userObject.liked.substring(1)
                arrayLiked = userObject.liked.split(",")
            }
            res.render('chatList', { name: req.session.user, like: arrayLiked, likedBy: arrayLikedBy });
        })
    });

})

//user chat
app.get('/chat', (req, res) => {
    var user = req.query.user.toString();
    var usernames = [];
    var oldMessages = [];
    var visitingUserObject = {}
    var chatID;
    //Create Chat ID
    usernames.push(user);
    usernames.push(req.session.user);
    usernames.sort()
    chatID = usernames[0] + usernames[1];

    let visitingUserInfoSql = `SELECT * FROM users WHERE username = '${user}'`;
    connection.query(visitingUserInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                visitingUserObject.username = result.username
                visitingUserObject.status = result.status
            })
            //GET all the messages between these users
            let chatInfoSql = `SELECT * FROM chat WHERE chatId = '${chatID}'`;
            connection.query(chatInfoSql, async (err, result) => {
                if (err) throw err;
                if (result) {
                    result.forEach(function (result) {
                        oldMessages.push(result)
                    })
                }
                res.render('chatView', { name: req.session.user, status: visitingUserObject.status, name: req.session.user, oldMessages: oldMessages, chatId: chatID, to: visitingUserObject.username, from: req.session.user })
            }
            )
        }
    })
})

module.exports = app;