var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

//Add to Gallery
app.post('/gallery', urlencodedParser, upload.single('photo'), (req, res) => {
    schema.user.findOne({ username: req.session.user }, function (err, data) {
        if (err) throw err;
        var str = []
        var len = data.gallery.length
        var i = len;
        var j = 0;

        if (data) {
            while (i) {
                str.push(data.gallery[j])
                i--;
                j++;
            }
            if (data.gallery == null) {
                str.push(req.file.buffer.toString('base64'));
            } else {
                if (len <= 3) {
                    str.push(req.file.buffer.toString('base64'))
                }
                if (len >= 4) {
                    str.shift(data.gallery)
                    str.push(req.file.buffer.toString('base64'))
                }
            }
            app.locals.galleryImages = str
            schema.user.findOneAndUpdate({ username: req.session.user },
                {
                    $set: {
                        gallery: str
                    }
                }, async function (err, data) {
                    if (err) throw err;
                    console.log('added to Gallery')
                    res.redirect('profile-page')
                })
        }
    })
})

module.exports = app;