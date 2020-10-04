import socketio from "socket.io";

//ここでまってるよ、リッスン//
const io = socketio(3000);

const players = new Set<string>();

let turn = 0;
let board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

io.on("connection", (socket: socketio.Socket) => {
  socket.on("clicked", (position: number, userID: string) => {
    if (userID !== Array.from(players)[turn % 2]) {
      return;
    }
    if (board[position] !== -1) {
      return;
    }
    board[position] = turn % 2;
    turn++;
    io.emit("clickedAll", board, turn);
    console.log(position, socket.id);
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
    io.emit("clickedAll", board, turn);
  });
});

function reset(server: socketio.Server) {
  server.emit("reset");
  turn = 0;
  board = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
}
