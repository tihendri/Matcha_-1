const express = require('express');
const session = require('express-session');
const app = express();
require('dotenv/config');
var socket = require('socket.io');
var flash = require('connect-flash')
const mailer = require('express-mailer');
const config = require('./config.js')
const port = config.port;
const connection = config.connection;

//Middleware
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(express.static(__dirname + '/public'));
app.use(flash())

//Import Routes
app.set('view engine', 'ejs');
app.use('/layout', express.static('layout'));
app.use('/images', express.static('images'));

mailer.extend(app, {
    from: 'matchaprojectsup@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'matchaprojectsup@gmail.com',
        pass: 'Matcha123'
    }
})

//ROUTES
app.use(require('./routes/login.js'));
app.use(require('./routes/register.js'));
app.use(require('./routes/forgotpass.js'));
app.use(require('./routes/home.js'));
app.use(require('./routes/profile.js'));
app.use(require('./routes/sort.js'));
app.use(require('./routes/changeLocation.js'));
app.use(require('./routes/chat.js'));
app.use(require('./routes/visitProfileGallery.js'));
app.use(require('./routes/visitprofile.js'));
app.use(require('./routes/filtersearch.js'));
app.use(require('./routes/gallery.js'));
app.use(require('./routes/images.js'));
app.use(require('./routes/likes.js'));
app.use(require('./routes/logout.js'));
app.use(require('./routes/reportuser.js'));

app.use(function (req, res, next) {
    res.locals.success_msg =
        req.flash('success_msg');
    res.locals.error_msg =
        req.flash('error_msg');
    res.locals.error =
        req.flash('error');
    next();
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    // HAVE TO CREATE ERROR PAGE!!!!!                                           <----------!!!!!
    res.render('error');
});

//Connect to DB mysql
connection.connect(function (error) {
    if (!!error) {
        console.log('ERROR');
    } else {

        console.log('MySQL Connected...');
    }
});
//create db
app.get('/createDatabase', (req, res) => {
    let sql = "CREATE DATABASE Matcha";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Database created...")
    })
})
//create User Table
app.get('/createTable', (req, res) => {
    let sql = "CREATE TABLE users(user_id INT AUTO_INCREMENT,name VARCHAR(100), surname VARCHAR(100),username VARCHAR(100),email VARCHAR(100), password VARCHAR(100),age INT, gender VARCHAR(100), sp VARCHAR(100), bio VARCHAR(100), verified BOOLEAN DEFAULT false,status VARCHAR(100) DEFAULT 'offline' ,image LONGTEXT, vkey LONGTEXT, sport VARCHAR(10) DEFAULT 'off',fitness VARCHAR(10) DEFAULT 'off',technology VARCHAR(10) DEFAULT 'off', music VARCHAR(10) DEFAULT 'off', gaming VARCHAR(10) DEFAULT 'off', ageBetween VARCHAR(20), city VARCHAR(200), country VARCHAR(200), postal VARCHAR(200),PRIMARY KEY (user_id))";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log("Users Table created...");
    })
    let galleryTableSql = "CREATE TABLE gallery(ID INT AUTO_INCREMENT ,user_id INT not null references users(user_id), gallery LONGTEXT, PRIMARY KEY (ID))";
    connection.query(galleryTableSql, (err, result) => {
        if (err) throw err;
        console.log("gallery Table created...");
    })
    let likedTableSql = "CREATE TABLE liked(ID INT AUTO_INCREMENT ,user_id INT not null references users(user_id), username VARCHAR(100), PRIMARY KEY (ID))";
    connection.query(likedTableSql, (err, result) => {
        if (err) throw err;
        console.log("Liked Table created...");
    })
    let likedByTableSql = "CREATE TABLE likedBy (ID INT AUTO_INCREMENT ,user_id INT not null references users(user_id), username VARCHAR(100), PRIMARY KEY (ID))";;
    connection.query(likedByTableSql, (err, result) => {
        if (err) throw err;
        console.log("LikedBy Table created...");
    })
    let viewedByTableSql = "CREATE TABLE viewedBy (ID INT AUTO_INCREMENT , user_id INT not null references users(user_id), username VARCHAR(100), PRIMARY KEY (ID))";
    connection.query(viewedByTableSql, (err, result) => {
        if (err) throw err;
        console.log("viewedBy Table created...");
    })
    let viewedProfileHistoryTableSql = "CREATE TABLE viewedProfileHistory (ID INT AUTO_INCREMENT ,user_id INT not null references users(user_id), username VARCHAR(100), PRIMARY KEY (ID))";
    connection.query(viewedProfileHistoryTableSql, (err, result) => {
        if (err) throw err;
        console.log("viewedProfileHistoryTableSql Table created...");
    })
    let chatTableSql = "CREATE TABLE chat(ID INT AUTO_INCREMENT ,chatId VARCHAR(100),ToUser VARCHAR(100), fromUser VARCHAR(100),msg LONGTEXT,created VARCHAR(100), PRIMARY KEY (ID))";
    connection.query(chatTableSql, (err, result) => {
        if (err) throw err;
        console.log("chat Table created...")
    })
    let blockedTableSql = "CREATE TABLE blocked(ID INT AUTO_INCREMENT , user_id INT not null references users(user_id), username VARCHAR(100), PRIMARY KEY (ID))";
    connection.query(blockedTableSql, (err, result) => {
        if (err) throw err;
        console.log("Blocked Table created...");
    })
    res.send("Database Tables Created...")
})

var server = app.listen(port, () => console.log('Server started on port', port));

function saveMsg(data) {
    let setViewedByRow = `INSERT INTO chat SET chatId = '${data.chatId}', fromUser = '${data.from}',toUser = '${data.to}',msg = '${data.message}',created = '${Date()}' `
    connection.query(setViewedByRow, (err, result) => {
        if (err) throw err;
        console.log('Messaged saved...')
    })
};
////////////////////////////UNCOMMENT THIS !!!///////////////////////
//-----------------------JUST A LAS WITH ALL THE EMAILS--------------------------
function notif_mail(from, to, notif) {
    // var userEmail;
    // let userInfoSql = `SELECT * FROM users WHERE username = '${to}'`;
    // connection.query(userInfoSql, async (err, result) => {
    //     if (err) throw err;
    //     if (result) {
    //         result.forEach(function (result) {
    //             userEmail = result.email
    //         })
    //         app.mailer.send('notif', {
    //             to: userEmail,
    //             subject: 'Matcha - Notification from ' + from,
    //             from: from,
    //             notif: notif
    //         }, function (err) {
    //             if (err) {
    //                 console.log(err);
    //                 return;
    //             }
    //             console.log('Notification email sent to ' + to);
    //         })
    //     }
    // })
}
//------------------------------------------UNCOMMENT TOP----------------

//Socket setup
var io = socket(server);
io.on('connection', function (socket) {
    socket.on('chat', function (data) {
        socket.join(data.chatId);
        io.sockets.to(data.chatId).emit('chat', data);
        saveMsg(data)
        io.sockets.to(data.to).emit('msg_notification', data.from);
        console.log('Message added to DB!')
        notif_mail(data.from, data.to, " has sent you a message!")
    });
    socket.on('liked', (data) => {
        io.sockets.to(data.to).emit('like_notification', data.from);
        console.log('Like notification!')
        notif_mail(data.from, data.to, " has liked your profile!")
    });
    socket.on('unliked', (data) => {
        io.sockets.to(data.to).emit('unlike_notification', data.from);
        console.log('unLike notification!')
        notif_mail(data.from, data.to, " has unliked your profile!")
    });
    socket.on('viewed', (data) => {
        io.sockets.to(data.to).emit('viewed_notification', data.from);
        console.log('view notification! from: ' + data.from)
        notif_mail(data.from, data.to, " has viewed your profile!")
    });
    socket.on('room', function (data) {
        socket.join(data);
    })
    socket.on('notif', function (data) {
        socket.join(data);
    })
});