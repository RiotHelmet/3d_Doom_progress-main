const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let connectedIds = [];

app.get("/editor", function (req, res) {
  res.sendFile(__dirname + "/public/Editor/index.html");
});

app.use(express.static(__dirname + "/public"));

io.sockets.on("connection", (socket) => {
  console.log(`⚡ : A user has connected : ${socket.id}`);
  connectedIds.push(socket.id);
  io.emit("updateConnections", connectedIds);
  io.emit("connect_client", socket.id);

  socket.on("updatePlayerPosition", (data) => {
    io.emit("sendPlayerPosition", data);
  });
  socket.on("disconnect", () => {
    console.log(`️‍🔥 : A user has disconnect : ${socket.id}`);
    connectedIds.splice(connectedIds.indexOf(socket.id), 1);
    io.emit("updateConnections", connectedIds);
    io.emit("disconnect_client", socket.id);
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
