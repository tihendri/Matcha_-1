const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const chatSchema = require('./models/chat');
require('dotenv/config');
var socket = require('socket.io');
var flash = require('connect-flash')
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

//Socket setup
var io = socket(server);
io.on('connection',function(socket){
    socket.on('chat',function(data){
        socket.join(data.chatId);
        io.sockets.to(data.chatId).emit('chat',data);
        saveMsg(data)
        io.sockets.to(data.to).emit('msg_notification',data.from);
        console.log('Message added to DB!')
    });
    socket.on('liked',(data)=>{
        io.sockets.to(data.to).emit('like_notification',data.from);
        console.log('Like notification!')
    });
    socket.on('unliked',(data)=>{
        io.sockets.to(data.to).emit('unlike_notification',data.from);
        console.log('unLike notification!')
    });
    socket.on('viewed',(data)=>{
        io.sockets.to(data.to).emit('viewed_notification',data.from);
        console.log('view notification!')
    });
    socket.on('room',function(data){
        socket.join(data);
    })
    socket.on('notif',function(data){
        socket.join(data);
    })
});

