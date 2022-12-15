import { CellStatus } from './../model/Cell';
import { Difficulty, GameResult } from './../model/grid/GameGrid';
import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { FixedGrid } from "@/model/grid/FixedGrid";
import type { Cell } from '@/model/Cell';

export const useGameStore = defineStore("game", () => {
  const countBombs = ref(10);
  const gameDuration = reactive({
    seconds: 0,
    paused: false
  });
  const gameResult = ref(GameResult.NOT_END);

  let gameGrid = reactive(new FixedGrid(Difficulty.EASY));

  const timer = setInterval(() => {
    if (!gameDuration.paused) {
      gameDuration.seconds++;
    }
  }, 1000);

  function incrementBombs(): void {
    countBombs.value++;
  }
  function decrementBombs(): void {
    countBombs.value--;
  }

  function togglePauseTimer(): boolean {
    gameDuration.paused = !gameDuration.paused;
    return gameDuration.paused;
  }

  function initGrid(difficulty: Difficulty): void {
    gameGrid = new FixedGrid(difficulty);
  }

  function automaticopenCellsAround(cell: Cell): void {
    gameGrid.automaticOpenAdjacentEmptyCell(cell);
  }

  function openCellsAround(cell: Cell) {
    const cellsAround = gameGrid.getCellsAround(cell);

    for (const cell of cellsAround) {
      if (!cell.hasFlag && cell.isBomb) {
        gameResult.value = GameResult.LOOSE;
      } else if (!cell.hasFlag) {
        cell.status = CellStatus.OPEN;
      } else {
        // cell has flag - n
      }
    }
  }

  /**
   * Return the number of cell with a flag around the current cell.
   * @param cell 
   */
  function numCellFlaggedAround(cell: Cell) {
    const cellsAround = gameGrid.getCellsAround(cell);
    return cellsAround.filter(cell => cell.hasFlag).length;
  }


  function clearTime(): void {
    clearInterval(timer);
  }

  return {
    countBombs,
    gameDuration,
    gameGrid,
    gameResult,
    incrementBombs,
    automaticopenCellsAround,
    decrementBombs,
    initGrid,
    openCellsAround,
    numCellFlaggedAround,
    togglePauseTimer
  };

});