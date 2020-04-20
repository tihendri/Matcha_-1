var express = require('express');
var app = express();
const chatSchema = require('../models/chat');
const schema = require('../models/User');

//Users you can chat to
app.get('/chatList', (req, res) => {
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        app.locals.databag = data
        if (data) {
            res.render('chatList', { name: req.session.user, like: data.like, likedBy: data.likedBy });
        }
    })
})

//user chat
app.get('/chat', (req, res) => {
    var user = req.query.user.toString();
    var chatId = [];
    chatId.push(user);
    chatId.push(req.session.user);
    chatId.sort()
    app.locals.nameOfusers1 = chatId[0] + chatId[1];


    schema.user.findOne({ username: user }, function (err, data) {
        app.locals.msgTo = data.username;
        app.locals.status = data.status
        if (err) throw err;
        schema.user.findOne({ username: req.session.user }, async function (err, data) {
            if (err) throw err;

            function findIndex(str) {
                var index = str.indexOf(app.locals.chats);
                console.log(index);
                return index
            }
            app.locals.liked = data.like;

            app.locals.count = findIndex(app.locals.liked);
        })
        chatSchema.chat.find({ chatId: app.locals.nameOfusers1 }, function (err, data) {
            if (err) throw err;

            res.render('chatView', { name: req.session.user, status: app.locals.status, name: req.session.user, oldMessages: data, chatId: app.locals.nameOfusers1, to: app.locals.msgTo, from: req.session.user })
        })
    });
});


module.exports = app;