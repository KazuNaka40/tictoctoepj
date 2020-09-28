import express from "express";
import socketio from "socket.io";

//ここでまってるよ、リッスン//
const io = socketio(3000);

const players: string[] = [];
let turn = 0;
let board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

io.on("connection", (socket: socketio.Socket) => {
  if (players.length >= 2) {
    socket.disconnect(true);
    console.log("disconnect");
    return;
  }
  players.push(socket.id);
  console.log(players);
  io.emit("sendMessageToClient", socket.id);
  socket.on("clicked", (position: number) => {
    if (socket.id !== players[turn % 2]) {
      return;
    }
    if (board[position] !== -1) {
      return;
    }
    board[position] = turn % 2;
    turn++;
    io.emit("clickedAll", position, socket.id, board, turn);
    console.log(position, socket.id);
  });
  socket.on("initGame", () => {
    reset(io);
  });
});

function reset(server: socketio.Server) {
  server.emit("reset");
  turn = 0;
  board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
}
