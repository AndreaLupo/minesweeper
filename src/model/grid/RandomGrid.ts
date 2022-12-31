import type { Cell } from "../Cell";
import { BOMB, Difficulty, GameGrid } from "./GameGrid";
import { reactive } from 'vue';

export class RandomGrid extends GameGrid {

  constructor(difficulty: Difficulty) {
    super(difficulty);
    this.setBombs(this.numbBombs);
    this.initCells();
  }


  moveBombsInEmptyCells(cell: Cell) {
    const cellsAround = reactive(this.getCellsAround(cell));

    let numBombsToBeMoved = 0;

    if (cell.isBomb) {
      cell.numberShown = 0;
      numBombsToBeMoved++;
    }
    for (const cellAround of cellsAround) {
      if (cellAround.isBomb) {
        cellAround.numberShown = 0;
        numBombsToBeMoved++;
      }
    }
    // put bombs in random free cells
    const freeCells: Cell[] = this.getFreeCells(numBombsToBeMoved, cellsAround);

    for (let count = 0; count < numBombsToBeMoved; count++) {
      const freeCell = freeCells[count];
      // set as bomb
      freeCell.numberShown = BOMB;
    }

    this.initCells();
  }

  /**
   * Return a list of random free cells from the list of cells.
   * @param numCells number of cells to return
   * @param freeCellsToExclude cells that won't be returned
   * @returns 
   */
  getFreeCells(numCells?: number, freeCellsToExclude?: Cell[]): Cell[] {
    let freeCells: Cell[] = [];

    for (const cells of this.cellList) {
      for (const cell of cells) {
        if (!cell.isBomb) {
          freeCells.push(cell);
        }
      }
    }

    // exclude free cell
    freeCells = freeCells.filter((el: Cell) => {
      if (freeCellsToExclude) {
        let include = true;
        for (const cel of freeCellsToExclude) {
          if (cel.column === el.column && cel.row === el.row) {
            include = false;
            break;
          }
        }
        return include;
      }
    });

    if (numCells) {
      const indexes: number[] = [];
      while (indexes.length < numCells) {
        const randomIndex = Math.floor(Math.random() * freeCells.length);
        if (indexes.indexOf(randomIndex) === -1) {
          indexes.push(randomIndex);
        }
      }
      freeCells = freeCells.filter((el: Cell, index: number) => indexes.includes(index));
    }

    return freeCells;
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