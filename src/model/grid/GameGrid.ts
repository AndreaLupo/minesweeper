import { Cell } from "../Cell";

export enum Difficulty {
  EASY,
  MEDIUM,
  DIFFICULT
}

export const BOMB: number = -1;

export abstract class GameGrid {
  protected cells: Cell[][] = [];
  protected maxRow: number = 0;
  protected maxCol: number = 0;
  protected numbBombs: number = 0;

  abstract setBombs: (numBombs: number) => void;

  constructor(public difficulty: Difficulty) {
    this.createGrid();
  }

  get cellList() {
    return this.cells;
  }

  get numRow() {
    return this.maxRow;
  }

  get numCol() {
    return this.maxCol;
  }

  createGrid = (): void => {
    let row: Array<Cell>;

    switch (this.difficulty) {
      case Difficulty.EASY:
        this.maxRow = 9;
        this.maxCol = 9;
        this.numbBombs = 10;
        break;
      case Difficulty.DIFFICULT:
      default:
        this.maxRow = 16;
        this.maxCol = 30;
        this.numbBombs = 99;
    }
    let countCell = 0;
    for (let index = 0; index < this.maxRow; index++) {
      row = new Array<Cell>(this.maxCol);
      for (let cellCol = 0; cellCol < this.maxCol; cellCol++) {
        let cell = row[cellCol];
        cell = new Cell();
        cell.key = countCell++;
        row[cellCol] = cell;
      }
      this.cells[index] = row;
    }
  }

  initCells = (): void => {
    for (let row = 0; row < this.cells.length; row++) {
      const rowCells = this.cells[row];
      for (let col = 0; col < rowCells.length; col++) {
        const numBombs = this.countBombsAround(row, col);
        this.cells[row][col].numberShown = numBombs;
      }
    }
  }

  countBombsAround = (row: number, col: number): number => {
    if (this.cells[row][col].isBomb) {
      return BOMB;
    }

    let countBomb = 0;

    let currRow = row - 1;
    let currCol = col - 1;

    const jumpCell = (): boolean => {
      const isRequestedCell = currRow === row && currCol === col;
      const isOutOfBound = currRow < 0 || currCol < 0 || currRow > (this.maxRow - 1) || currCol > (this.maxCol - 1);
      return isRequestedCell || isOutOfBound;
    };

    countBomb += !jumpCell() && this.cells[currRow][currCol++].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow][currCol++].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow++][currCol].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow++][currCol].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow][currCol--].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow][currCol--].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow--][currCol].isBomb ? 1 : 0;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;


    return countBomb;
  }

}