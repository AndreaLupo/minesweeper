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

  constructor(public key: number, public row: number, public column: number) {

  }

  get isBomb(): boolean {
    return this.numberShown === BOMB;
  }

  get hasBombsNearby(): boolean {
    return this.numberShown !== 0;
  }
}