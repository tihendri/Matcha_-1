var express = require('express');
var app = express();
const mongoose = require('mongoose');
const schema = require('../models/User');
const Grid = require('gridfs-stream');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var config = require('../config.js')
const connection = config.connection;
//mongo Uri
// const mongoURI = 'mongodb+srv://Matcha:Matcha123@wethinkcode-je391.mongodb.net/Matcha?retryWrites=true&w=majority';
var galleryObject = []
var viewedHistory;
var arrayViewedHistory = [];
var arrayLikeHistory = [];
var likeHistory;
var arrayViewedBy = [];
var viewedBy;
//Create mongo connection
//const conn = mongoose.createConnection(mongoURI);
app.locals.count = 1;

//Init gfs
// let gfs;
// connection.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
// })

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

//display images
// app.get('/image-upload', (req, res) => {
//     gfs.files.find().toArray((err, files) => {
//         //check if files
//         app.locals.galleryLen = data.gallery.length
//         if (!files || files.length == 0) {
//             res.render('image-upload', { name: req.session.user, files: false });
//         } else {
//             files.map(files => {
//                 if (
//                     files.contentType === 'image/jpeg' ||
//                     files.contentType === 'image/png'
//                 ) {
//                     files.isImage = true;
//                 } else {
//                     files.isImage = false;
//                 }
//             });
//             if (app.locals.errlog == undefined)
//                 app.locals.errlog = 'Please fill in the form to login!';
//             res.render('image-upload', { name: req.session.user, galleryLen: app.locals.galleryLen, files: files, username: req.session.user });
//         }
//     }

//     )
// });

//------------------------------------------LOAD USER PROFILE--------------------------------
app.get('/profile-page', async (req, res) => {
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
// // //Display image
// app.get('/image/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, files) => {
//         //check if files
//         if (!files || files.length == 0) {
//             return res.status(404).json({
//                 err: 'No file exist'
//             });
//         }

//         if (
//             files.contentType === 'image/jpeg' ||
//             files.contentType === 'image/png'
//         ) {
//             const readstream = gfs.createReadStream(files.filename);
//             readstream.pipe(res);
//         } else {
//             res.status(404).json({
//                 err: 'Not an image'
//             });
//         }

//     })
// });

// //uploads file to db
// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.body.imgtype);
//     res.redirect('/profile-page');
// })

module.exports = app;