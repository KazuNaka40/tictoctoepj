const squares = document.querySelectorAll(".square");
const squaresArray = [].slice.call(squares);

let flag = true;
let counter = 9;

squaresArray.forEach((square) => {
  square.addEventListener("click", () => {
    if (flag === true) {
      square.classList.add("js-maru-checked");
      square.classList.add("js-unclickable");
      if (isWinner("maru")) {
        setMessage("maru-win");
        gameOver();
        return;
      }
      setMessage("batsu-turn");
      flag = false;
    } else {
      square.classList.add("js-batsu-checked");
      square.classList.add("js-unclickable");
      if (isWinner("batsu")) {
        setMessage("batsu-win");
        gameOver();
        return;
      }
      setMessage("maru-turn");
      flag = true;
    }
    counter--;
    if (counter === 0) {
      setMessage("draw");
      gameOver();
    }
  });
});

const messages = document.querySelectorAll(".message-list li");
const messagesArray = [].slice.call(messages);

function setMessage(id) {
  messagesArray.forEach((message) => {
    if (message.id === id) {
      message.classList.remove("js-hidden");
    } else {
      message.classList.add("js-hidden");
    }
  });
}

function filterById(targetArray, idArray) {
  return targetArray.filter((e) => {
    return e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2];
  });
}

const line1 = filterById(squaresArray, ["1-1", "1-2", "1-3"]);
const line2 = filterById(squaresArray, ["2-1", "2-2", "2-3"]);
const line3 = filterById(squaresArray, ["3-1", "3-2", "3-3"]);
const line4 = filterById(squaresArray, ["1-1", "2-1", "3-1"]);
const line5 = filterById(squaresArray, ["1-2", "2-2", "3-2"]);
const line6 = filterById(squaresArray, ["1-3", "2-3", "3-3"]);
const line7 = filterById(squaresArray, ["1-1", "2-2", "3-3"]);
const line8 = filterById(squaresArray, ["1-3", "2-2", "3-1"]);

const lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];
let winningLine = null;

function isWinner(symbol) {
  const result = lineArray.some((line) => {
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
  return result;
}

const resetBtn = document.getElementById("reset-btn");

let gameOver = () => {
  squaresArray.forEach((square) => {
    square.classList.add("js-unclickable");
  });

  if (winningLine) {
    winningLine.forEach((square) => {
      square.classList.add("js-highLight");
    });
  }

  resetBtn.classList.remove("js-hidden");
};

function initGame() {
  flag = true;
  counter = 9;
  winningLine = null;
  squaresArray.forEach((square) => {
    square.classList.remove("js-maru-checked");
    square.classList.remove("js-batsu-checked");
    square.classList.remove("js-unclickable");
    square.classList.remove("js-highLight");
  });
  setMessage("maru-turn");
  resetBtn.classList.add("js-hidden");
}

resetBtn.addEventListener("click", () => {
  initGame();
});
