var io = require('socket.io')();

// Lista de players vinculados ao socketId {socketId: player}
var players = {};


var Player = function(id){
  this.id = id;
  this.hp = 100;
  this.live = true;
};

Player.prototype.getId = function()
{
  return this.id;
};
Player.prototype.getName = function()
{
  return this.name;
};
Player.prototype.setName = function(name)
{
      this.name = name;
};
Player.prototype.getHp = function()
{
  return this.hp;
};
Player.prototype.damage = function(damage)
{
      var newHp = this.hp - damage;

      if(newHP > 0)
      {
        this.hp = newHp;
      }
      else {
        this.hp = 0;
        this.live = false;
      }
};
Player.prototype.toJSON = function()
{
  return {id: this.getId()};
};

/**
  Outcoming Notifications
*/
var notification = {

  localPlayer: {
    move: 'TWLocalPlayerNotification.Move'
  },

  remotePlayer: {
    enter: 'TWRemotePlayerNotification.Enter',
    leave: 'TWRemotePlayerNotification.Leave',
    move: 'TWRemotePlayerNotification.Move'
  }
}

io.on('connection', onIOConnection);
io.listen(3000);


function onIOConnection(socket)
{
  console.log('onIOConnection', socket.id);

  var p = new Player(socket.id);
  players[p.getId];

  // Tells everyody that the player spawned
  socket.broadcast.emit(notification.remotePlayer.enter, p.toJSON());

  setupNotifications(socket);
}


function setupNotifications(socket)
{
  console.log('setupIncomingNotifications');

  socket.on('disconnect', function()
  {
    onSocketDisconnect(socket);
  });

  socket.on('error', function()
  {
    onSocketError(socket);
  });

  socket.on(notification.localPlayer.move, function(localPlayerMoveData)
  {
      localPlayerMoveData.id = socket.id;
      onLocalPlayerMove(socket, localPlayerMoveData);
  });
}



function onSocketDisconnect(socket)
{
  console.log('onSocketDisconnect', socket.id);
}

function onSocketError(socket)
{
  console.log('onSocketError', socket.id);
}

function onLocalPlayerMove(socket, localPlayerMoveData)
{
  console.log('onLocalPlayerMove', localPlayerMoveData);

  // Broadcast player position to all players
  socket.broadcast.emit(notification.remotePlayer.move, localPlayerMoveData);
}
