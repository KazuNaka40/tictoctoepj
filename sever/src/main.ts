import express from "express";
import socketio from "socket.io";

//ここでまってるよ、リッスン//
const io = socketio(3000);

const players = new Set<string>();

let turn = 0;

io.on("connection", (socket: socketio.Socket) => {
  /*if (players.length >= 2) {
    socket.disconnect(true);
    console.log("disconnect");
    return;
  }
  players.push(1socket.id);*/
  socket.on("clicked", (position: number, userID: string) => {
    if (userID == Array.from(players)[turn % 2]) {
      io.emit("clickedAll", position, socket.id);
      console.log(position, socket.id);
      turn++;
    }
  });
  socket.on("initGame", () => {
    reset(io);
  });
  socket.on("userID", (userID: string) => {
    console.log(userID);
    if (!players.has(userID) && players.size >= 2) {
      socket.disconnect(true);
      console.log("disconnect");
      return;
    }
    players.add(userID);
  });
});

function reset(server: socketio.Server) {
  server.emit("reset");
  turn = 0;
}
