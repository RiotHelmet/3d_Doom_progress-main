const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const crypto = require("crypto");
const mysql = require("mysql");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

let connectedIds = [];

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class playerInfo {
  kills = 0;
  color = getRandomColor();
  constructor(_ID) {
    this.ID = _ID;
  }
}

// connection

let leaderboard = [];

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shooterDatabase",
});

app.get("/editor", function (req, res) {
  res.sendFile(__dirname + "/public/Editor/index.html");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(__dirname + "/public"));

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  io.sockets.on("connection", (socket) => {
    console.log(`⚡ : A user has connected : ${socket.id}`);
    connectedIds.push(socket.id);
    // leaderboard.push(new playerInfo(socket.id));
    io.emit("updateConnections", connectedIds);
    // io.emit("connect_client", socket.id);

    // Request Player info, position etc.
    socket.on("requestPlayerInformation_Server", (data) => {
      console.log("Request : ", data.sender);
      io.emit("requestPlayerinformation_Client", data);
    });
    socket.on("recievePlayerInformation_Server", (data) => {
      console.log("Recieved from ", data.id);
      io.emit("recievePlayerInformation_Client", data);
    });

    // Update Player Position
    socket.on("updatePlayerPosition", (data) => {
      io.emit("sendPlayerPosition", data);
    });

    socket.on("playerKilled", (data) => {
      leaderboard.forEach((Player) => {
        console.log(Player.ID, data.shooterID);
        if (Player.ID == data.shooterID) {
          Player.kills++;
        }
      });

      for (let i = 0; i < leaderboard.length - 1; i++) {
        if (leaderboard[i].kills < leaderboard[i + 1].kills) {
          p = leaderboard[i + 1];
          leaderboard[i + 1] = leaderboard[i];
          leaderboard[i] = p;
        }
      }
      io.emit("updateLeaderboard", { leaderboard: leaderboard });
    });

    socket.on("raycastHIT", (data) => {
      io.emit("damagePlayer", data);
    });

    socket.on("loginRequest", (data) => {
      console.log(data);

      con.query(
        `
          SELECT * FROM
            userdata
      
          WHERE username = '${data.username}'
          `,
        function (err, result, fields) {
          if (err) throw err;
          if (result[0]) {
            if (result[0].password == hashPassword(data.password)) {
              io.emit("login", {
                userID: result[0].userID,
                username: data.username,
                ID: data.ID,
              });

              console.log("Login successful");
            } else {
              console.log("Login failed");
            }
          }
        }
      );
    });

    socket.on("disconnect", () => {
      console.log(`️‍🔥 : A user has disconnect : ${socket.id}`);
      connectedIds.splice(connectedIds.indexOf(socket.id), 1);
      io.emit("updateConnections", connectedIds);
      io.emit("disconnect_client", socket.id);
    });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
