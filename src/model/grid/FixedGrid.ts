import { BOMB, Difficulty } from './GameGrid';
import { GameGrid } from "./GameGrid";

export class FixedGrid extends GameGrid {

  constructor(difficulty: Difficulty) {
    super(difficulty);
    this.setBombs(this.numbBombs);
    this.initCells();
  }

  setBombs = (numBombs: number): void => {
    if (this.difficulty === Difficulty.EASY) {
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
    }
  }
}