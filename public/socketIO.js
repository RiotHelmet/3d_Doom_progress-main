let clientID;

let connectedIDs;

socket.on("connect", () => {
  clientID = socket.id;
});


socket.on("damagePlayer", (data) => {
  if (player.id == data.ID) {
    player.health -= 50;
    if (player.health <= 0) {
      socket.emit("playerKilled", data);

      alert("DEAD");
      player.position = { x: 0, y: 0, z: 0 };
      player.health = 100;
    }
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

socket.on("updateLeaderboard", function (data) {
  leaderboard = data.leaderboard;

  document.getElementById("leaderboard").innerHTML = "";
  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].kills > 0) {
      document.getElementById(
        "leaderboard"
      ).innerHTML += `<div class="leaderboardIcon"><h1>${leaderboard[i].kills}</h1></div>`;
    }
  }

  console.log(leaderboard);
});

socket.on("requestPlayerinformation_Client", (data) => {
  console.log(data.sender, clientID);
  if (data.sender !== clientID) {
    socket.emit("recievePlayerInformation_Server", {
      position: player.position,
      rotation: player.rotation,
      id: clientID,
      sender: data.sender,
    });
  }
});

socket.on("recievePlayerInformation_Client", (data) => {
  for (let i = 0; i < players.length; i++) {
    const Player = players[i];
    if ((Player.id == data.id)) {
      Player.position = data.position;
      Player.rotation = data.rotation;
      Player.shape.position = data.position;
      break;
    }
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
