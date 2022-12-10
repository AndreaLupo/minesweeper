import { BOMB } from "./grid/GameGrid";

export class Cell {
  key: number = 0;
  open: boolean = false;
  numberShown: number = 0;

  get isBomb(): boolean {
    return this.numberShown === BOMB;
  }
}