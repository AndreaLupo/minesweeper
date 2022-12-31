import { BOMB } from "./grid/GameGrid";

export enum CellStatus {
  CLOSED,
  OPEN,
  QUESTION_MARK,
  FLAGGED,
  BOOM
}


export class Cell {
  status: CellStatus = CellStatus.CLOSED;
  numberShown: number = 0;
  public clickable: boolean = true;

  constructor(public key: number, public row: number, public column: number) {

  }

  get isBomb(): boolean {
    return this.numberShown === BOMB;
  }

  get isOpen(): boolean {
    return this.status === CellStatus.OPEN;
  }
  get hasFlag(): boolean {
    return this.status === CellStatus.FLAGGED;
  }

  /**
   * Check if the user open the cell or if he flagged the cell.
   */
  get hasValueFromUser(): boolean {
    return this.isOpen || this.hasFlag;
  }

  /**
   * The cell has a value from user, but it's wrong, i.e. he puts a flag where there is no bomb or there is no flag on a bomb.
   */
  get hasWrongValueFromUser(): boolean {
    return this.hasValueFromUser && ((this.isBomb && !this.hasFlag) || (!this.isBomb && this.hasFlag));
  }

  get hasBombsNearby(): boolean {
    return this.numberShown !== 0;
  }


  isPosition(row: number, col: number): boolean {
    return this.row === row && this.column === col;
  }

}
