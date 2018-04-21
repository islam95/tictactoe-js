var board;
const human = 'O';
const computer = 'X';
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

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
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
		if (!checkCells()) turn(bestSpot(), computer);
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
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
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