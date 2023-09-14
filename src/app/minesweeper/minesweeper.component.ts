import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit {
  board: BoardSquare[][] = [[]]; // a bi-dimensional matrix for board
  bombProbability = 3;
  maxProbability = 15;
  selectedDifficulty: string = "easy" // default is on "easy"
  gameLost: boolean = false;

  ngOnInit() {
    // generate the initial board with the default difficulty
    this.generateBoard();
  }

  generateBoard() {
    this.board = [];
    let rows: number = 0;
    let col: number = 0;

    switch (this.selectedDifficulty) {
      case "easy":
        rows = 5;
        col = 5;
        break;
      case "medium":
        rows = 10;
        col = 10;
        break;
      case "hard":
        rows = 15;
        col = 15;
        break;
      default:
        break;
    }
    // build the board game
    for (let i = 0; i < rows; i++) {
      const row: BoardSquare[] = [];
      for (let j = 0; j < col; j++) {
        row.push(new BoardSquare(false, 0, false, false));
      }
      this.board.push(row);
    }

    // put the bombs and update "bombsAround" variable accordingly
    // (if a bomb is placed on a cell, then all the neighbouring
    // cells must increment "bombsAround" variable)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < col; j++) {
        if (Math.random() * this.maxProbability < this.bombProbability) {
          this.board[i][j].setHasBomb(true);
          if (i - 1 >= 0) {
            let bombsBefore: number = this.board[i - 1][j].getBombs();
            this.board[i - 1][j].setBombsAround(bombsBefore + 1);
          }
          if (i + 1 < rows) {
            let bombsBefore: number = this.board[i + 1][j].getBombs();
            this.board[i + 1][j].setBombsAround(bombsBefore + 1);
          }
          if (j - 1 >= 0) {
            let bombsBefore: number = this.board[i][j - 1].getBombs();
            this.board[i][j - 1].setBombsAround(bombsBefore + 1);
          }
          if (j + 1 < col) {
            let bombsBefore: number = this.board[i][j + 1].getBombs();
            this.board[i][j + 1].setBombsAround(bombsBefore + 1);
          }
          if (i + 1 < rows && j + 1 < col) {
            let bombsBefore: number = this.board[i + 1][j + 1].getBombs();
            this.board[i + 1][j + 1].setBombsAround(bombsBefore + 1);
          }
          if (i + 1 < rows && j - 1 >= 0) {
            let bombsBefore: number = this.board[i + 1][j - 1].getBombs();
            this.board[i + 1][j - 1].setBombsAround(bombsBefore + 1);
          }
          if (i - 1 >= 0 && j + 1 < col) {
            let bombsBefore: number = this.board[i - 1][j + 1].getBombs();
            this.board[i - 1][j + 1].setBombsAround(bombsBefore + 1);
          }
          if (i - 1 >= 0 && j - 1 >= 0) {
            let bombsBefore: number = this.board[i - 1][j - 1].getBombs();
            this.board[i - 1][j - 1].setBombsAround(bombsBefore + 1);
          }

        }
      }
    }
    console.log(this.board);
  }


  // on a click "opened" variable is set on "true"
  handleCellClick(rowIndex: number, colIndex: number) {
    console.log(this.board[rowIndex][colIndex]);
    this.board[rowIndex][colIndex].setOpened(true);
    this.checkGameWon();
  }

  // on right-click "flagged" variable is set on "true"
  onRightClick(event: MouseEvent, rowIndex: number, colIndex: number) {
    event.preventDefault()
    this.board[rowIndex][colIndex].setFlagged(true);
    this.checkGameWon();
  }

  // if a cell with a bomb is clicked, then the game is lost
  checkGameLost(rowIndex: number, colIndex: number) {
    if (this.board[rowIndex][colIndex].getHasBomb()) {
      this.gameLost = true;
      alert('You lost!');
      window.location.reload();
    }
  }

  // if all cells are either opened or flagged, then the game is won
  checkGameWon() {
    let allCellsOpenedOrFlagged = true;

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const cell = this.board[i][j];

        if (!cell.getOpened() && !cell.getFlagged()) {
          allCellsOpenedOrFlagged = false;
          break;
        }
      }
      if (!allCellsOpenedOrFlagged) {
        break;
      }
    }

    if (allCellsOpenedOrFlagged) {
      alert('You won');
      window.location.reload();
    }
  }
}

// this is the class for each cell
class BoardSquare {
  private hasBomb: boolean;
  private bombsAround: number;
  private opened: boolean;
  private flagged: boolean;

  constructor(hasBomb: boolean, bombsAround: number, opened: boolean, flagged: boolean) {
    this.hasBomb = hasBomb;
    this.bombsAround = bombsAround;
    this.opened = opened;
    this.flagged = flagged;
  }

  public setHasBomb(hasBomb: boolean) {
    this.hasBomb = hasBomb;
  }

  public setBombsAround(bombsAround: number) {
    this.bombsAround = bombsAround;
  }

  public setOpened(opened: boolean) {
    this.opened = opened;
  }

  public setFlagged(flagged: boolean) {
    this.flagged = flagged;
  }

  public getBombs() {
    return this.bombsAround;
  }

  public getFlagged() {
    return this.flagged;
  }

  public getOpened() {
    return this.opened;
  }

  public getHasBomb() {
    return this.hasBomb;
  }
}
