const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const chatSchema = require('./models/chat');
const schema = require('./models/User');
require('dotenv/config');
var socket = require('socket.io');
var flash = require('connect-flash')
const mailer = require('express-mailer');
const config = require('./config.js')
const port = config.port;

//Middleware
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
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
app.use(require('./routes/visitprofile.js'));
app.use(require('./routes/filtersearch.js'));
app.use(require('./routes/gallery.js'));
app.use(require('./routes/images.js'));
app.use(require('./routes/likes.js'));
app.use(require('./routes/logout.js'));
app.use(require('./routes/reportuser.js'));

app.use(function(req,res,next){
    res.locals.success_msg =
    req.flash('success_msg');
    res.locals.error_msg =
    req.flash('error_msg');
    res.locals.error =
    req.flash('error');
    next();
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    // HAVE TO CREATE ERROR PAGE!!!!!                                           <----------!!!!!
    res.render('error');
});

//Connect to DB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(
   process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to DB!', '\nServer is up and running!')
);

//How to start listening to the server
var server = app.listen(port, () => console.log('Server started on port', port));

function saveMsg(data) {
    chatSchema.chat({ chatId: data.chatId, from: data.from, msg: data.message, to: data.to }).save(function (err) {
    });
};

function notif_mail(from, to, notif) {
    schema.user.findOne({ username: to }, async function (err, data) {
        if (err) throw err;

        app.mailer.send('notif', {
            to: data.email,
            subject: 'Matcha - Notification from ' + from,
            from: from,
            notif: notif
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Notification email sent to ' + from);
        })
})}

//Socket setup
var io = socket(server);
io.on('connection',function(socket){
    socket.on('chat',function(data){
        socket.join(data.chatId);
        io.sockets.to(data.chatId).emit('chat',data);
        saveMsg(data)
        io.sockets.to(data.to).emit('msg_notification',data.from);
        console.log('Message added to DB!')
        notif_mail(data.from, data.to, " has sent you a message!")
    });
    socket.on('liked',(data)=>{
        io.sockets.to(data.to).emit('like_notification',data.from);
        console.log('Like notification!')
        notif_mail(data.from, data.to, " has liked your profile!")
    });
    socket.on('unliked',(data)=>{
        io.sockets.to(data.to).emit('unlike_notification',data.from);
        console.log('unLike notification!')
        notif_mail(data.from, data.to, " has unliked your profile!")
    });
    socket.on('viewed',(data)=>{
        io.sockets.to(data.to).emit('viewed_notification',data.from);
        console.log('view notification! from: ' + data.from)
        notif_mail(data.from, data.to, " has viewed your profile!")
    });
    socket.on('room',function(data){
        socket.join(data);
    })
    socket.on('notif',function(data){
        socket.join(data);
    })
});

