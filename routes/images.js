var express = require('express');
var app = express();
const mongoose = require('mongoose');
const schema = require('../models/User');
const Grid = require('gridfs-stream');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//mongo Uri
const mongoURI = 'mongodb+srv://Matcha:Matcha123@wethinkcode-je391.mongodb.net/Matcha?retryWrites=true&w=majority';

//Create mongo connection
const conn = mongoose.createConnection(mongoURI);
app.locals.count = 1;

//Init gfs
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

//render Profile upload page
app.get('/profilePic', (req, res) => {
    res.render('profilePic')
});

//loads form
app.get('/image-upload', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        //check if files
        if (!files || files.length == 0) {
            res.render('image-upload', {name: req.session.user, files: false });
        } else {
            files.map(files => {
                if (
                    files.contentType === 'image/jpeg' ||
                    files.contentType === 'image/png'
                ) {
                    files.isImage = true;
                } else {
                    files.isImage = false;
                }
            });
            if (files.Profile == 'Profile Picture') {

                app.locals.profilePicture = req.session.user;
            }
            if (app.locals.errlog == undefined)
                app.locals.errlog = 'Please fill in the form to login!';
            res.render('image-upload', {name: req.session.user, files: files });
        }
    }
    )
});
//display images
app.get('/image-upload', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        //check if files
        app.locals.galleryLen = data.gallery.length
        if (!files || files.length == 0) {
            res.render('image-upload', {name: req.session.user, files: false });
        } else {
            files.map(files => {
                if (
                    files.contentType === 'image/jpeg' ||
                    files.contentType === 'image/png'
                ) {
                    files.isImage = true;
                } else {
                    files.isImage = false;
                }
            });
            if (app.locals.errlog == undefined)
                app.locals.errlog = 'Please fill in the form to login!';
            res.render('image-upload', {name: req.session.user, galleryLen: app.locals.galleryLen, files: files, username: req.session.user });
        }
    }
    )
});

//load home-images
app.get('/profile-page', (req, res) => {
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        if (data) {
            app.locals.fameRating = data.likedBy.length
            app.locals.image = data.image
            app.locals.galleryImage = data.gallery
            app.locals.galleryLen = data.gallery.length
            app.locals.viewedBy = data.viewedBy

        }
        res.render('profile-page', {like:"0", viewedBy: app.locals.viewedBy ,name: req.session.user, galleryLen: app.locals.galleryLen, gallery: app.locals.galleryImage, photo: app.locals.image, username: req.session.user, fameRating: app.locals.fameRating });
    })
});
//Display image
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, files) => {
        //check if files
        if (!files || files.length == 0) {
            return res.status(404).json({
                err: 'No file exist'
            });
        }

        if (
            files.contentType === 'image/jpeg' ||
            files.contentType === 'image/png'
        ) {
            const readstream = gfs.createReadStream(files.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }

    })
});

//uploads file to db
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body.imgtype);
    res.redirect('/profile-page');
})

module.exports = app;