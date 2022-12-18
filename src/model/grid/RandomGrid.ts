import { BOMB, Difficulty, GameGrid } from "./GameGrid";

export class RandomGrid extends GameGrid {

  constructor(difficulty: Difficulty) {
    super(difficulty);
    this.setBombs(this.numbBombs);
    this.initCells();
  }

  setBombs = (numBombs: number): void => {
    for (let count = 0; count < numBombs;) {
      const row = Math.floor(Math.random() * this.numRow);
      const col = Math.floor(Math.random() * this.numCol);

      if (this.cells[row][col].numberShown !== BOMB) {
        this.cells[row][col].numberShown = BOMB;
        count++;
      }
    }
  };
}