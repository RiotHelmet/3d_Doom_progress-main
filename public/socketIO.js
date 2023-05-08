var socket = io();

let clientID;
let connectedIDs;

socket.on("connect", () => {
  clientID = socket.id;
});

socket.on("connect_client", (ID) => {
  if (loadingIn) {
    connectedIDs.forEach((ID) => {
      if (ID !== clientID) {
        new Player(ID);
      }
    });
    loadingIn = false;
  }

  if (ID !== clientID) {
    new Player(ID);
  }
});

socket.on("disconnect_client", (ID) => {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == ID) {
      console.log(objects);
      objects.splice(objects.indexOf(players[i].shape), 1);
      console.log(objects);

      players.splice(i, 1);
    }
  }
});

socket.on("updateConnections", (connectionArray) => {
  connectedIDs = connectionArray;
  console.log(connectedIDs);
});

function updatePlayerPosition() {
  socket.emit("updatePlayerPosition", {
    ID: clientID,
    position: player.position,
    rotation: player.rotation,
  });
}

socket.on("sendPlayerPosition", function (data) {
  if (data.ID !== clientID) {
    updateOtherPlayers(data.ID, data.position, data.rotation);
  }
});

socket.on("sendPlayerPosition", function (data) {
  if (data.ID !== clientID) {
    updateOtherPlayers(data.ID, data.position, data.rotation);
  }
});

function updateOtherPlayers(ID, position, rotation) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id == ID) {
      if (position.x !== players[i].position.x) {
        players[i].animation.walking = true;
        players[i].animation.idle = false;
        players[i].animation.walking_step += 0.05;
        if (players[i].animation.walking_step > 4) {
          players[i].animation.walking_step = 0;
        }
      }
      players[i].position = position;
      players[i].rotation = rotation;
      players[i].shape.position = players[i].position;
    }
  }
}

function resetPlayerAnimation() {
  players.forEach((Player) => {
    Player.animation.idle = true;
    Player.animation.walking = false;
    Player.animation.shooting = false;
  });
}
