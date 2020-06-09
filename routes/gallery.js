var express = require('express');
var app = express();
const schema = require('../models/User');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var config = require('../config.js')
const connection = config.connection;
var len 
var  gallery = [];
var galleryID = [];
var newGalleryImage;

//Add to Gallery
app.post('/addImageTogallery', urlencodedParser, upload.single('photo'), (req, res) => {
  

    if (req.file.buffer) {
      
    // schema.user.findOne({ username: req.session.user }, function (err, data) {
    //     if (err) throw err;
    //     // var str = []
    //     // var len = data.gallery.length
    //     // var i = len;
    //     // var j = 0;
    let userGalleryInfoSql = `SELECT * FROM gallery WHERE user_id = '${req.session.user_id}'`;
    connection.query(userGalleryInfoSql, async (err, result) => {
        if (err) throw err;
        if (result) {
            galleryID = []
            len = 0;
            result.forEach(function (result) {

                gallery.push(result.gallery)
                galleryID.push(result.ID)
            })
            if(gallery){
                len = galleryID.length
            console.log("This is the gallery == " + len)
            console.log("This is the galleryID == " + galleryID)
            }
        
        }
   
            
            // while (i) {
            //     gallery.push(ga)
            //     i--;
            //     j++;
            // }
            // if (len == 1) {
            //     // gallery.push(req.file.buffer.toString('base64'))
            //     newGalleryImage = req.file.buffer.toString('base64')
            //     let updateUserGallerySql = `UPDATE gallery SET gallery = '${newGalleryImage}' WHERE user_id ='${req.session.user_id}'`;
            //     connection.query(updateUserGallerySql, async (err, result) => {
            //         if (err) throw console.log('NOT added to Gallery')
            //         console.log('added to Gallery')
            //         res.redirect('profile-page')
            //     });
            //    //str.push(req.file.buffer.toString('base64'));
            // } else {
                if (len <= 4) {
                    // gallery.push(req.file.buffer.toString('base64'))
                    newGalleryImage = req.file.buffer.toString('base64')
                    let updateUserGallerySql = `INSERT INTO gallery SET gallery = '${newGalleryImage}', user_id ='${req.session.user_id}'`;
                    connection.query(updateUserGallerySql, async (err, result) => {
                        if (err) throw console.log('NOT added to Gallery')
                        console.log('added to Gallery')
                        res.redirect('profile-page')
                    });
                }
                if (len > 4) {
                    //REMOVE MIN gallery ID
                    //Because only 4 images aloud in gallery
                    let removeUserGallerySql = `DELETE FROM gallery WHERE ID ='${galleryID[1]}'`;
                     connection.query(removeUserGallerySql, async (err, result) => {
                        if (err) throw console.log('Did not remove from Gallery')
                        console.log('Removed from Gallery')
                        // res.redirect('profile-page')
                    
                    // gallery.shift(gallery)
                    newGalleryImage = req.file.buffer.toString('base64')
                    console.log("In gallery  more than 4")
                    let updateUserGallerySql = `INSERT INTO gallery SET gallery = '${newGalleryImage}', user_id ='${req.session.user_id}'`;
                    connection.query(updateUserGallerySql, async (err, result) => {
                        if (err) throw console.log('NOT added to Gallery')
                        console.log('added to Gallery')
                        res.redirect('profile-page')
                    });
                });
                }
               
            // }
           
            // }
            // if(str.length != 0){

            // app.locals.galleryImages = str
           
            // schema.user.findOneAndUpdate({ username: req.session.user },
            //     {
            //         $set: {
            //             gallery: str
            //         }
            //     }, async function (err, data) {
                    
            //         res.redirect('profile-page');
                    
                    
                    
            //     })
            
            
        })
    
        
    }
        
    // )
// }

})

    

module.exports = app;