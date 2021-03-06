/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(playerNum, color) {
    this.color = color;
    this.playerNum = playerNum;
  }
}

class Game {

  constructor(height, width, player1, player2) {
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.height = height;
    this.width = width;
    this.form = document.querySelector("#form");
    this.startButton = document.querySelector("#start-button");
    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = this.player1.color;
  }



  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const HTML_BOARD = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    HTML_BOARD.append(top);

    // make main part of HTML_BOARD
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      HTML_BOARD.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    this.startButton.innerHTML = "RESTART"
    this.form.style.display = "flex"
    document.querySelector("#column-top").classList.add("no-click")
    // this.startButton.classList.remove("no-click");
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer} wins!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1.color ? this.player2.color : this.player1.color;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    function _win(cells, height, width, board, currPlayer) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (
          _win(horiz, this.height, this.width, this.board, this.currPlayer) ||
          _win(vert, this.height, this.width, this.board, this.currPlayer) ||
          _win(diagDR, this.height, this.width, this.board, this.currPlayer) ||
          _win(diagDL, this.height, this.width, this.board, this.currPlayer)
        ) { return true; }
      }
    }
  }
  
  setGame() {
    this.startButton.addEventListener("click", this.startGame.bind(this))
  }
  
  startGame() {
    if (!document.querySelector("#player1").value || !document.querySelector("#player2").value) {
      return;
    }
    // this.startButton.classList.add("no-click");  // ask why I can't remove event listener..
    this.form.style.display = "none"
    this.player1.color = document.querySelector("#player1").value;
    this.player2.color = document.querySelector("#player2").value;
    this.currPlayer = this.player1.color;
    // console.log(this.player1.color, this.player2.color)
    this.clearBoard();
    this.makeBoard();
    this.makeHtmlBoard();
    this.form.reset();
  }
  
  clearBoard() {
    this.board = [];
    document.querySelector("#board").innerHTML = ""
  }

}

let player1 = new Player(1, "red");
let player2 = new Player(2, "blue");
let myGame = new Game(6, 7, player1, player2);


myGame.setGame();