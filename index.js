var io = require('socket.io')();

io.on('connection', function(socket){
    console.log('connection');

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

    socket.on('playerUpdate', function(pos){
        console.log('update', pos);
    });

});

io.listen(3000);
