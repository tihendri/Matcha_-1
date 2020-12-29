// Make connection
var socket = io.connect('localhost:8010');

// Query DOM
var message = document.getElementById('message'),
      from = document.getElementById('from'),
      to = document.getElementById('to'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      chatId = document.getElementById('chatId');
      feedback = document.getElementById('feedback');

if (chatId){
      socket.emit('room',chatId.value)
// Emit events
btn.addEventListener('click', function(){
    // io.sockets.to().emit('notification')
    socket.emit('chat', {
        message: message.value,
        from: from.value,
        to: to.value,
        chatId:chatId.value
    });
    message.value = "";
});
}
    
// Listen for events
socket.on('chat', (data)=>{
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.from + ': </strong>' + data.message + '</p>';
});
socket.on('typing',function(data){
    feedback.innerHTML ="<p><em>"+data +" is typing a message...</em></p>";
})
