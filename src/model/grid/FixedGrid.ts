import { BOMB, Difficulty } from './GameGrid';
import { GameGrid } from "./GameGrid";

export class FixedGrid extends GameGrid {

  constructor(difficulty: Difficulty) {
    super(difficulty);
    this.setBombs();
    this.initCells();
  }

  setBombs = (): void => {
    if (this.difficulty === Difficulty.TUTORIAL) {
      this.setbombsInRow(0, [3]);
      this.setbombsInRow(2, [2]);
      this.setbombsInRow(3, [4]);
      this.setbombsInRow(4, [4]);
    } else if (this.difficulty === Difficulty.EASY) {
      this.cells[0][6].numberShown = BOMB;
      this.cells[0][7].numberShown = BOMB;
      this.cells[4][0].numberShown = BOMB;
      this.cells[4][5].numberShown = BOMB;
      this.cells[5][0].numberShown = BOMB;
      this.cells[6][2].numberShown = BOMB;
      this.cells[6][5].numberShown = BOMB;
      this.cells[8][0].numberShown = BOMB;
      this.cells[8][2].numberShown = BOMB;
      this.cells[8][4].numberShown = BOMB;
    } else if (this.difficulty === Difficulty.MEDIUM) {
      this.setbombsInRow(0, [0, 7, 9, 11, 14]);
      this.setbombsInRow(1, [1]);
      this.setbombsInRow(2, [5, 14]);
      this.setbombsInRow(3, [1, 13]);
      this.setbombsInRow(4, [1, 8, 13]);
      this.setbombsInRow(5, [0]);
      this.setbombsInRow(7, [11, 12]);
      this.setbombsInRow(8, [1, 6]);
      this.setbombsInRow(9, [4, 12]);
      this.setbombsInRow(10, [4, 12, 13, 14]);
      this.setbombsInRow(11, [1, 6, 9, 14]);
      this.setbombsInRow(12, [1, 9, 11, 13, 14, 15]);
      this.setbombsInRow(13, [2]);
      this.setbombsInRow(14, [3, 8, 10]);
      this.setbombsInRow(15, [5, 10]);
    }
  }

  setbombsInRow = (row: number, cols: number[]): void => {
    for (const col of cols) {
      this.setBomb(row, col);
    }
  }

  setBomb = (row: number, col: number): void => {
    this.cells[row][col].numberShown = BOMB;
  }
}