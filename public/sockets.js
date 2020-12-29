$(function(){
    // buttons and inputs for messaging.
    var chatFrom = $("#from");
    var chatTo = $("#to");
    var send_message = $("#send");
    var message = $("#message");
	var chatroom = $("#output");
	var chatRoomName = $("#sendChatId");

    // buttons and inputs for handling the morphing socket ids
    var user = $("#is_user");
    var login = $("#login");
    var email = $("#email");
    var like = $("#like");
    var liker = $("#liker");
    var potmatch = $("#potmatch");
    // buttons and inputs for the notifications
    var notifblock = $("#notifblock");
    var view = $("#profile_view");
    var viewed = $("#profile_viewed");
    // make connection.
    var socket = io.connect();
    socket.on('connect', () => update());
    function update() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
    }

    // Emit a new message
    send_message.click(function() {
        // this sends the new client id, will change it to do that on reload of any page
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('new_message', {message: message.val(), chatFrom: chatFrom.val(), chatTo: chatTo.val(), chatID: [chatTo.val(), chatFrom.val()].sort().join('-')});
    });

    // create a tracker for a user on login
    login.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('login_notif', {user: user.val()});
        socket.emit('login', {email: email.val()});
    })
    // Send notif info on a like click to server
    like.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('new_like', {liked: potmatch.val(), liker: liker.val()});
    }) 

    // send to server on profile getting viewed
    view.click(function() {
        var str = (window.location).toString();
        socket.emit('update', {user: user.val(), id: socket.id, page: str});
        socket.emit('new_view', {viewer: user.val(), viewed: viewed.val()});
    })
});