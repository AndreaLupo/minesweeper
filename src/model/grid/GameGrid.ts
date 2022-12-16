import { Cell, CellStatus } from "../Cell";

export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  DIFFICULT = "DIFFICULT"
}

export enum GameResult {
  NOT_END,
  WIN,
  LOOSE
}

export const BOMB: number = -1;

export interface GameStatusGrid {
  printDebugGrid(whatToPrint: string): void;
  getCellsAround(cell: Cell): Cell[];
  automaticOpenAdjacentEmptyCell(cell: Cell): void;
}

export abstract class GameGrid implements GameStatusGrid {
  protected cells: Cell[][] = [];
  protected maxRow: number = 0;
  protected maxCol: number = 0;
  protected numbBombs: number = 0;

  abstract setBombs: (numBombs: number) => void;

  constructor(public difficulty: Difficulty) {
    this.createGrid();
  }

  get cellList(): Cell[][] {
    return this.cells;
  }

  get numRow() {
    return this.maxRow;
  }

  get numCol() {
    return this.maxCol;
  }

  /**
   * Return the number of cell present in the grid.
   */
  get totalNumCells() {
    return this.maxRow * this.maxCol;
  }

  get gameComplete(): boolean {
    return this.countOpenCell() === this.totalNumCells && this.checkAllCellsHaveValueFromUser();
  }

  get allCellsAreOpenedOrFlagged(): boolean {
    for (const cells of this.cellList) {
      for (const cell of cells) {
        if (!cell.isOpen && !cell.hasFlag) {
          return false;
        }
      }
    }
    return true;
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
        cell = new Cell(countCell++, index, cellCol);
        row[cellCol] = cell;
      }
      this.cells[index] = row;
    }
  }


  /**
   * Useful to check the current status of the grid.
   * Print a table with the STATUS field of each cell.
   */
  printDebugGrid = (whatToPrint: string): void => {
    const table: string[] = [];
    for (let index = 0; index < this.maxRow; index++) {
      let row: string = '';
      for (let cellCol = 0; cellCol < this.maxCol; cellCol++) {
        const cell: Cell = this.cells[index][cellCol];
        if (whatToPrint === 'status') {
          row += ' ' + cell.status;
        }
        if (whatToPrint === 'numbers') {
          row += ' ' + cell.numberShown;
        }
        if (!whatToPrint || whatToPrint === 'bombs') {
          row += ' ' + cell.isBomb;
        }
      }
      table.push(row);
    }
    console.log(table);
  }

  /**
   * Set the number of bombs for each cell. Should be called only on Grid creation.
   */
  initCells = (): void => {
    for (let row = 0; row < this.cells.length; row++) {
      const rowCells = this.cells[row];
      for (let col = 0; col < rowCells.length; col++) {
        const numBombs = this.countBombsAround(row, col);
        this.cells[row][col].numberShown = numBombs;
      }
    }
  }

  getCell = (row: number, column: number): Cell => {
    return this.cellList[row][column];
  }

  /**
   * Return the number of bombs around the requested cell
   * @param row 
   * @param col 
   * @returns 
   */
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

    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currCol++;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currCol++;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currRow++;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currRow++;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currCol--;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currCol--;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;
    currRow--;
    countBomb += !jumpCell() && this.cells[currRow][currCol].isBomb ? 1 : 0;

    return countBomb;
  }

  /**
   * Check if the row and column requested are within the grid indexes.
   * @param currRow 
   * @param currCol 
   * @returns 
   */
  isValidCell(currRow: number, currCol: number): boolean {
    const isOutOfBound = currRow < 0 || currCol < 0 || currRow > (this.maxRow - 1) || currCol > (this.maxCol - 1);
    return !isOutOfBound;
  }

  getCellsAround = (cell: Cell): Cell[] => {
    const minRow = cell.row - 1;
    const minCol = cell.column - 1;
    const maxRow = minRow + 2;
    const maxCol = minCol + 2;

    const cells: Cell[] = [];
    for (let currRow = minRow; currRow <= maxRow; currRow++) {
      for (let currCol = minCol; currCol <= maxCol; currCol++) {
        if (this.isValidCell(currRow, currCol) && !cell.isPosition(currRow, currCol)) {
          cells.push(this.cells[currRow][currCol]);
        }
      }
    }
    return cells;
  }

  automaticOpenAdjacentEmptyCell = (cell: Cell): void => {
    if (!cell.hasBombsNearby && cell.status !== CellStatus.OPEN) {
      cell.status = CellStatus.OPEN;
      const cellsAround: Cell[] = this.getCellsAround(cell);
      for (const cellAround of cellsAround) {
        this.automaticOpenAdjacentEmptyCell(cellAround);
      }
    }
  }

  countOpenCell = (): number => {
    let totalOpen = 0;
    for (const rowCells of this.cells) {
      const openCells = rowCells.filter((cell: Cell) => cell.isOpen);
      totalOpen += openCells.length;
    }
    return totalOpen;
  }

  checkAllCellsHaveValueFromUser = (): boolean => {
    for (const rowCells of this.cells) {
      for (const cell of rowCells) {
        if (!cell.hasValueFromUser) {
          return false;
        }
      }
    }
    return true;
  }

  evaluateEndGame(): GameResult {
    if (!this.gameComplete) {
      return GameResult.NOT_END;
    }

    if (this.allUserFlagsOnBombs()) {
      return GameResult.WIN;
    }

    return GameResult.LOOSE;
  }

  allUserFlagsOnBombs() {
    for (const rowCells of this.cells) {
      for (const cell of rowCells) {
        if (cell.hasWrongValueFromUser) {
          return false;
        }
      }
    }
    return true;
  }
}