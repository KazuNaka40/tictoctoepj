import io from "socket.io-client";
import $ from "jquery";
import { v4 as uuidv4 } from "uuid";

let userID = sessionStorage.getItem("userID");

if (userID == null) {
  userID = uuidv4();
  sessionStorage.setItem("userID", userID);
}

console.log(userID);

const url = "localhost:3000";
const socket = io.connect(url);

//サーバから受け取るイベントを作成
socket.emit("userID", userID);

socket.on("sendMessageToClient", function (data: string) {
  $("#msg_list").prepend("<li>" + data + "</li>");
});

const squares = document.querySelectorAll(".square");

squares.forEach((square, position: number) => {
  square.addEventListener("click", () => {
    socket.emit("clicked", position, userID);
  });
});

socket.on("clickedAll", (board: number[], turn: number) => {
  $("#msg_list").prepend("<li>" + board + "</li>");
  squares.forEach((square, position: number) => {
    if (board[position] == 0) {
      squares[position].classList.add("js-maru-checked");
    } else if (board[position] == 1) {
      squares[position].classList.add("js-batsu-checked");
    }
  });
  if (isWinner("maru")) {
    setMessage("maru-win");
    gameOver();
    return;
  }
  if (isWinner("batsu")) {
    setMessage("batsu-win");
    gameOver();
    return;
  }
  if (!board.includes(-1)) {
    setMessage("draw");
    gameOver();
    return;
  }

  if (turn % 2 == 1) {
    setMessage("batsu-turn");
  } else {
    setMessage("maru-turn");
  }
});

const messages = document.querySelectorAll(".message-list li");

function setMessage(id: string) {
  messages.forEach((message) => {
    if (message.id === id) {
      message.classList.remove("js-hidden");
    } else {
      message.classList.add("js-hidden");
    }
  });
}

function filterById(targetArray: NodeListOf<Element>, idArray: string[]) {
  return [...targetArray].filter((e) => {
    return e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2];
  });
}

const line1 = filterById(squares, ["1-1", "1-2", "1-3"]);
const line2 = filterById(squares, ["2-1", "2-2", "2-3"]);
const line3 = filterById(squares, ["3-1", "3-2", "3-3"]);
const line4 = filterById(squares, ["1-1", "2-1", "3-1"]);
const line5 = filterById(squares, ["1-2", "2-2", "3-2"]);
const line6 = filterById(squares, ["1-3", "2-3", "3-3"]);
const line7 = filterById(squares, ["1-1", "2-2", "3-3"]);
const line8 = filterById(squares, ["1-3", "2-2", "3-1"]);

const lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];
let winningLine: Element[] | null = null;

function isWinner(symbol: string) {
  return lineArray.some((line) => {
    const subResult = line.every((square) => {
      if (symbol === "maru") {
        return square.classList.contains("js-maru-checked");
      } else if (symbol === "batsu") {
        return square.classList.contains("js-batsu-checked");
      }
    });
    if (subResult) {
      winningLine = line;
    }
    return subResult;
  });
}

const resetBtn = document.getElementById("reset-btn");

let gameOver = () => {
  squares.forEach((square) => {
    square.classList.add("js-unclickable");
  });

  if (winningLine) {
    winningLine.forEach((square) => {
      square.classList.add("js-highLight");
    });
  }

  resetBtn?.classList.remove("js-hidden");
};

function initGame() {
  winningLine = null;
  squares.forEach((square) => {
    square.classList.remove("js-maru-checked");
    square.classList.remove("js-batsu-checked");
    square.classList.remove("js-unclickable");
    square.classList.remove("js-highLight");
  });
  setMessage("maru-turn");
}

resetBtn?.addEventListener("click", () => {
  socket.emit("initGame");
});

socket.on("reset", () => {
  initGame();
});
