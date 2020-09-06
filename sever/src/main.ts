import express from "express";
import socketio from "socket.io";

const io = socketio(3000);

io.on("connection", (socket: socketio.Socket) => {
  io.emit("sendMessageToClient", "1人入室しました。");
});
