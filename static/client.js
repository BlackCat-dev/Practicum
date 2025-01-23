socket.on('connect', function() {
    var room = window.location.pathname;
    socket.emit('join_room', { room: room });
});

function changeRoom(){
    var room = window.location.pathname;
    socket.emit('leave_room', { room: room });
}
