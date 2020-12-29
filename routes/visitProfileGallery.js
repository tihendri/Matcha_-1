var express = require('express');
var app = express();
const session = require('express-session');
var config = require('../config.js')
const connection = config.connection;

//Display Visiters Gallery
app.get('/visitingGallery', (req, res) => {
    console.log("visiting user == "+req.session.visiting)

    var visitingUserObject = {}
    var galleryObject = [];
    let visitingUserInfoSql = `SELECT * FROM users WHERE username = '${req.session.visiting}'`;
    connection.query(visitingUserInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            result.forEach(function (result) {
                visitingUserObject.user_id = result.user_id
                visitingUserObject.image = result.image
                visitingUserObject.status = result.status
            })
            console.log("you are here")
        
        let visitingUserGalleryInfoSql = `SELECT * FROM gallery WHERE user_id = '${visitingUserObject.user_id}'`;
        connection.query(visitingUserGalleryInfoSql, async (err, result) => {
            if (err) throw err;
            if (result) {
                galleryObject = [];
                result.forEach(function (result) {
                    if (result.gallery) {
                        galleryObject.push(result.gallery)
                    }
                })
            
            
        
        
                  console.log("you are here")
                  console.log("visitingUserObject.user_id == "+ visitingUserObject.user_id)
                  res.render('visitingGallery', { status: visitingUserObject.status, name: req.session.user, gallery: galleryObject, photo: visitingUserObject.image });

            }else{
                console.log("you are here")
                res.render('visitingGallery', { status: visitingUserObject.status, name: req.session.user, gallery: galleryObject, photo: visitingUserObject.image });

            }

            });
        }
        
    })
})

        module.exports = app;