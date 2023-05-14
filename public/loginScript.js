var socket = io();

// let clientID;

// socket.on("connect", () => {
//     clientID = socket.id;
//   });

loginPage = document.getElementById("loginMenu");
loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  username = document.getElementById("unameInput").value;
  password = document.getElementById("pwordInput").value;

  if (username && password) {
    socket.emit("loginRequest", { username: username, password: password, ID : clientID });
  }
});

// window.location.href = "someOtherFile.html";

socket.on("login", (data) => {
  if(data.ID == clientID) {
    document.cookie = data.userID;
    game.playing = true;

    if (loadingIn) {
      player.id = clientID
      connectedIDs.forEach((ID) => {
        if (ID !== clientID) {
          new Player(ID);
        }
      });
      loadingIn = false;


    }
    document.getElementById("leaderboard").style.display ="flex"
    loginPage.style.display = "none";
  }

  if (data.ID !== clientID) {
    new Player(data.ID);
  }

});
