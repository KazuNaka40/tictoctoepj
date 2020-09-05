var squares = document.querySelectorAll('.square');
var squaresArray = [].slice.call(squares);
var flag = true;
var counter = 9;
squaresArray.forEach(function (square) {
    square.addEventListener('click', function () {
        if (flag === true) {
            square.classList.add('js-maru-checked');
            square.classList.add('js-unclickable');
            if (isWinner('maru')) {
                setMessage('maru-win');
                gameOver();
                return;
            }
            setMessage("batsu-turn");
            flag = false;
        }
        else {
            square.classList.add('js-batsu-checked');
            square.classList.add('js-unclickable');
            if (isWinner('batsu')) {
                setMessage('batsu-win');
                gameOver();
                return;
            }
            setMessage("maru-turn");
            flag = true;
        }
        counter--;
        if (counter === 0) {
            setMessage('draw');
            gameOver();
        }
    });
});
var messages = document.querySelectorAll('.message-list li');
var messagesArray = [].slice.call(messages);
function setMessage(id) {
    messagesArray.forEach(function (message) {
        if (message.id === id) {
            message.classList.remove('js-hidden');
        }
        else {
            message.classList.add('js-hidden');
        }
    });
}
function filterById(targetArray, idArray) {
    return targetArray.filter(function (e) {
        return (e.id === idArray[0] || e.id === idArray[1] || e.id === idArray[2]);
    });
}
var line1 = filterById(squaresArray, ['1-1', '1-2', '1-3']);
var line2 = filterById(squaresArray, ['2-1', '2-2', '2-3']);
var line3 = filterById(squaresArray, ['3-1', '3-2', '3-3']);
var line4 = filterById(squaresArray, ['1-1', '2-1', '3-1']);
var line5 = filterById(squaresArray, ['1-2', '2-2', '3-2']);
var line6 = filterById(squaresArray, ['1-3', '2-3', '3-3']);
var line7 = filterById(squaresArray, ['1-1', '2-2', '3-3']);
var line8 = filterById(squaresArray, ['1-3', '2-2', '3-1']);
var lineArray = [line1, line2, line3, line4, line5, line6, line7, line8];
var winningLine = null;
function isWinner(symbol) {
    var result = lineArray.some(function (line) {
        var subResult = line.every(function (square) {
            if (symbol === 'maru') {
                return square.classList.contains('js-maru-checked');
            }
            else if (symbol === 'batsu') {
                return square.classList.contains('js-batsu-checked');
            }
        });
        if (subResult) {
            winningLine = line;
        }
        return subResult;
    });
    return result;
}
var resetBtn = document.getElementById('reset-btn');
var gameOver = function () {
    squaresArray.forEach(function (square) {
        square.classList.add('js-unclickable');
    });
    if (winningLine) {
        winningLine.forEach(function (square) {
            square.classList.add('js-highLight');
        });
    }
    resetBtn.classList.remove('js-hidden');
};
function initGame() {
    flag = true;
    counter = 9;
    winningLine = null;
    squaresArray.forEach(function (square) {
        square.classList.remove('js-maru-checked');
        square.classList.remove('js-batsu-checked');
        square.classList.remove('js-unclickable');
        square.classList.remove('js-highLight');
    });
    setMessage('maru-turn');
    resetBtn.classList.add('js-hidden');
}
resetBtn.addEventListener('click', function () {
    initGame();
});
