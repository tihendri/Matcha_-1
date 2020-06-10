var express = require('express');
var app = express();
const session = require('express-session');
var config = require('../config.js')
const connection = config.connection;

// //View another persons Page
// app.get('/visitProfile', (req, res) => {
//     console.log(req.session.user);
//     schema.user.findOne({ username: req.session.user }, function (err, data) {
//         if (err) throw err;
//         if (data) {
//             app.locals.like = data.like;
//         }
//     }).then(() => {
//         var user = req.query.user.toString();
//     schema.user.findOne({ username: user }, function (err, data) {
//         app.locals.fame = data.likedBy.length
//         app.locals.status = data.status
//         app.locals.likedBy = data.likedBy
//         app.locals.visitingUser = data.username
//         function findIndex(str) {
//             var index = str.indexOf(app.locals.visitingUser);
//             return index
//         }
//         var count = findIndex(app.locals.like);
//         if (count == '-1') {
//             app.locals.count = '-1'
//         }
//         else if (count == '0') {
//             app.locals.count = '0'
//         }
//         app.locals.likeCount = count
//         app.locals.visiting = data.username;
//         if (err) throw err;
//         console.log(app.locals.count)
//         console.log('help')
//         res.render('visitProfile', { name: req.session.user, like: app.locals.count, status: data.status, to: app.locals.visiting, photo: data.image, name: data.name, surname: data.surname, username: data.username, age: data.age, gender: data.gender, sp: data.sp, bio: data.bio, dislike: data.dislike, sport: data.sport, fitness: data.fitness, technology: data.technology, music: data.music, gaming: data.gaming, fame: app.locals.fame });
//     })})

// });

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