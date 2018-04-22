var board;
// Choose X or O
const x = document.querySelector('#x');
const o = document.querySelector('#o');
const choose = document.querySelector(".choose");
const endgame = document.querySelector(".endgame");
var humna = '';
var computer = '';

const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

function reset(){
	choose.style.display = "block";
	endgame.style.display = "none";
}

const cells = document.querySelectorAll('.cell');

x.addEventListener('click', function(){
	human = 'X';
	computer = 'O';
	choose.style.display = "none";
	startGame();
});

o.addEventListener('click', function(){
	human = 'O';
	computer = 'X';
	choose.style.display = "none";
	startGame();
});

function startGame() {
	endgame.style.display = "none";
	board = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', clickCell, false);
	}
}

function clickCell(cell) {
	if (typeof board[cell.target.id] == 'number') {
		turn(cell.target.id, human);
		if (!checkCells()) {
			setTimeout(function(){ 
				turn(bestSpot(), computer); 
			}, 1000);
		}
	}
}

function turn(cellId, player) {
	board[cellId] = player;
	document.getElementById(cellId).innerText = player;
	let gameWon = checkWin(board, player);
	if (gameWon) gameOver(gameWon);

}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor = gameWon.player == human ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', clickCell, false);
	}
	declareWinner(gameWon.player == human ? "You win!" : "You lose.");
}

function declareWinner(who) {
	endgame.style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(board, computer).index;
}

function checkCells() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', clickCell, false);
		}
		declareWinner("Draw!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
