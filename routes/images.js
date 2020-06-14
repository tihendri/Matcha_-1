var express = require('express');
var app = express();

const Grid = require('gridfs-stream');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var config = require('../config.js')
const connection = config.connection;
var galleryObject = []
var viewedHistory;
var arrayViewedHistory = [];
var arrayLikeHistory = [];
var likeHistory;
var arrayViewedBy = [];
var viewedBy;

app.locals.count = 1;


//render Profile upload page
app.get('/profilePic', (req, res) => {
    res.render('profilePic')
});

//loads form
//-------------------------------------------GETS image from your computer-------------------------------
app.get('/image-upload', (req, res) => {
    res.render('image-upload', { name: req.session.user });
});
//-------------------------------------------GETS image DONE-------------------------------



//------------------------------------------LOAD USER PROFILE--------------------------------
app.get('/profile-page', async (req, res) => {
    app.locals.erreg = 'You can change your profile info here!';
    
    let userInfoSql = `SELECT * FROM users WHERE username = '${req.session.user}'`;
    connection.query(userInfoSql, async (err, result) => {
        if (err) throw err;
        result.forEach(function (result) {
            if (result) {
                app.locals.image = result.image
            }
        })
        let likedByInfoSql = `SELECT username FROM likedBy WHERE user_id = '${req.session.user_id}'`;
        connection.query(likedByInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    if(result.username){
                    app.locals.fameRating = ((result.username.split(',').length) - 1)
                    }else{
                        app.locals.fameRating = 0
                    }
                })
            }
        });
        let viewedByInfoSql = `SELECT * FROM viewedBy WHERE user_id = '${req.session.user_id}'`;
        connection.query(viewedByInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    
                    viewedBy = result.username
                })
                if(viewedBy){
                viewedBy = viewedBy.substring(1)
                arrayViewedBy = viewedBy.split(',')
                }else{
                    arrayViewedBy = []
                }
            }
        });
        let viewedProfileHistoryInfoSql = `SELECT * FROM viewedProfileHistory WHERE user_id = '${req.session.user_id}'`;
        connection.query(viewedProfileHistoryInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    viewedHistory = result.username
                })
                if(viewedHistory){
                viewedHistory = viewedHistory.substring(1)
                arrayViewedHistory = viewedHistory.split(",")
                }else{
                    arrayViewedHistory = []
                }
            }
        });
        let likedInfoSql = `SELECT * FROM liked WHERE user_id = '${req.session.user_id}'`;
        connection.query(likedInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                result.forEach(function (result) {
                    likeHistory = result.username
                })
                if(likeHistory){
                likeHistory = likeHistory.substring(1)
                arrayLikeHistory = likeHistory.split(",")
                }else{
                    arrayLikeHistory =[];
                }
            }
        });
        let galleryInfoSql = `SELECT * FROM gallery WHERE user_id = '${req.session.user_id}'`;
        connection.query(galleryInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                galleryObject = [];
                result.forEach(function (result) {
                    if (result.gallery) {
                        galleryObject.push(result.gallery)
                    }
                })
                if (galleryObject) {
                    app.locals.galleryLen = galleryObject.length
                } else {
                    app.locals.galleryLen = 0;
                }
            }
            res.render('profile-page', { like: "0", likeHistory: arrayLikeHistory, viewedProfileHistory: arrayViewedHistory, viewedBy: arrayViewedBy, name: req.session.user, galleryLen: app.locals.galleryLen, gallery: galleryObject, photo: app.locals.image, username: req.session.user, fameRating: app.locals.fameRating });

        });
    });
});
//-----------------------------------------END OF User page------------------------------------------------------
module.exports = app;