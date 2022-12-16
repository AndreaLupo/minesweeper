import { useStatisticsStore } from './statistics';
import { CellStatus } from './../model/Cell';
import { Difficulty, GameResult } from './../model/grid/GameGrid';
import { isReactive, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { FixedGrid } from "@/model/grid/FixedGrid";
import type { Cell } from '@/model/Cell';


export const useGameStore = defineStore("game", () => {
  const countBombs = ref(10);
  const statisticsStore = useStatisticsStore();

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

  function openCell(cell: Cell) {
    const cel = reactive(gameGrid.getCell(cell.row, cell.column));
    if (CellStatus.FLAGGED === cel.status) {
      // don't have to open cell if the player is wrong!
      return;
    }

    if (cel.isBomb) {
      cel.status = CellStatus.BOOM;
      endGame(GameResult.LOOSE);
    }

    if (!cel.hasBombsNearby) {
      // cell will be opened in automatic cell update
      // emit("openEmptyAdjacent", cell);
      openCellsAround(cell);
    } else {
      cel.status = CellStatus.OPEN;
    }
  }

  function openCellsAround(cell: Cell) {
    console.log('Open cells with store');
    const cellsAround = reactive(gameGrid.getCellsAround(cell));
    console.log('Is reactive?', isReactive(cellsAround));


    for (const cell of cellsAround) {
      if (!cell.hasFlag && cell.isBomb) {
        gameResult.value = GameResult.LOOSE;
      } else if (!cell.hasFlag) {
        cell.status = CellStatus.OPEN;
      } else {
        // cell has flag - n
      }
    }
    cell.status = CellStatus.OPEN;
  }

  function endGame(result: GameResult) {
    console.log('End game with store!');
    gameResult.value = result;
    togglePauseTimer();
    if (result === GameResult.LOOSE) {
      statisticsStore.incrementLostGames();
    } else {
      statisticsStore.incrementWinGames();
      statisticsStore.checkAndUpdateBestTime(gameDuration.seconds);
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
    openCell,
    openCellsAround,
    endGame,
    numCellFlaggedAround,
    togglePauseTimer
  };

});