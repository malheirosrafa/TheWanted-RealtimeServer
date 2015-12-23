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

/**
  Outcoming Notifications
*/
var notification = {

  actionable: {
    // Active Actions
    Attack: 'ActionableNotification.Attack',
    Move:   'ActionableNotification.Move',

    // Passive Actions
    Damage: 'ActionableNotification.Damage',

    // Livecycle
    Die:    'ActionableNotification.Die',
    Spawn:  'ActionableNotification.Spawn'
  },

  user: {
    NotFound: 'UserNotification.NotFound'

  }
}

io.on('connection', onIOConnection);
io.listen(3000);


function onIOConnection(socket)
{
  console.log('onSocketConnection', socket.id);

  socket.on('disconnect', function()
  {
    onSocketDisconnect(socket);
  });

  socket.on('error', function()
  {
    onSocketError(socket);
  });

  var p = new Player(socket.id);
  players[p.getId];

  // Tells everyody that the player spawned
  onActionableSpawned(socket, {id:p.getId()});

  /**
    Income Actions (talvez serão removidos)
  */
  // Verificar da autorização socket/player ser feita ou validada pelo servidor de incomes
//   socket.on(
//       events.SessionNotification.DidAuthorizedPlayer,
//       function(data)
//       {
//         console.log(events.SessionNotification.DidAuthorizedPlayer, data);
//
//         sockets[data.playerId] = socket;
//       }
//   );
//
//   socket.on(
//     events.PlayerMoveNotification.DidUpdateToLocation,
//     function(data)
//     {
//       console.log(events.PlayerMoveNotification.DidUpdateToLocation, data);
//     }
//   );
//
  setupIncomingNotifications(socket);
}


function setupIncomingNotifications(socket)
{
  console.log('setupIncomingNotifications');

  // Actionable Move notification
  socket.on(notification.actionable.Move, function(actionableData)
  {
      actionableData.id = socket.id;
      onActionableMove(socket, actionableData);
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

function onActionableMove(socket, actionable) {
  console.log('onActionableMove', actionable);

  // Broadcast player position to all players
  io.emit(notification.actionable.Move, actionable);
}


/**
  Notify all sockets that something spawned
*/
function onActionableSpawned(socket, actionable)
{
  console.log('onActionableSpawned', actionable);

  io.emit(notification.actionable.Spawn, actionable);
}
