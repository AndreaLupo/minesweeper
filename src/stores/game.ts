import type { SelectDirection } from './../model/SelectDirection';
import { RandomGrid } from '../model/grid/RandomGrid';
import { gameSettings } from '../model/GameSettings';
import { useStatisticsStore } from './statistics';
import { CellStatus } from '../model/Cell';
import { Difficulty, GameGrid, GameResult } from '../model/grid/GameGrid';
import { isReactive, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { FixedGrid } from "@/model/grid/FixedGrid";
import type { Cell } from '@/model/Cell';
import useTimer from '@/composable/timer';


export const useGameStore = defineStore("game", () => {
  console.log('Init gameStore.');
  const statisticsStore = useStatisticsStore();

  const gameResult = ref(GameResult.NOT_END);

  const difficulty = ref(localStorage.getItem('currentGameDifficulty') as Difficulty);
  console.log('Difficulty in store:', difficulty.value);
  const countBombs = ref(gameSettings[difficulty.value].numBombs);


  const gameGrid = isTutorial() ? reactive(new FixedGrid(Difficulty.EASY)) : reactive(new RandomGrid(difficulty.value));
  const selectedCell = ref<Cell>(gameGrid.getCell(0, 0));

  const { gameDuration, createTimer, resetTime, togglePauseTimer } = useTimer();

  function isTutorial() {
    const tutorialActive = localStorage.getItem('tutorial');
    if (tutorialActive === 'true') {
      return true;
    } else {
      return false;
    }
  }

  function setTutorial(tutorialActive: boolean) {
    localStorage.setItem('tutorial', tutorialActive.toString());
  }

  function getDifficulty() {
    const difficulty = localStorage.getItem('currentGameDifficulty') as Difficulty;
    return ref(difficulty);
  }
  function setDifficulty(diff: Difficulty) {
    localStorage.setItem("currentGameDifficulty", diff);
    difficulty.value = diff;

  }

  function incrementBombs(): void {
    countBombs.value++;
  }
  function decrementBombs(): void {
    countBombs.value--;
  }
  function restoreBombs(): void {
    countBombs.value = gameSettings[difficulty.value].numBombs;
  }




  function initGrid(newDifficulty: Difficulty): void {
    console.log(`InitGrid for difficulty ${newDifficulty} with tutorial? ${isTutorial()}`);
    difficulty.value = newDifficulty;
    if (isTutorial()) {
      //gameGrid = reactive(new FixedGrid(difficulty));
      Object.assign(gameGrid, reactive(new FixedGrid(newDifficulty)));
    } else {
      Object.assign(gameGrid, reactive(new RandomGrid(newDifficulty)));
      //gameGrid = reactive(new RandomGrid(difficulty));
    }
    // gameGrid.printDebugGrid('numbers');
    restoreBombs();
    console.log(`Rows: ${gameGrid.numRow}, Cols: ${gameGrid.numCol}`);
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
    const cellsAround = reactive(gameGrid.getCellsAround(cell));


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

  function selectCell(direction: SelectDirection) {
    if (selectedCell.value == null) {
      selectedCell.value = gameGrid.getCell(0, 0);
      return;
    }
    let newRow: number;
    let newCol: number;
    switch (direction) {
      case 'DOWN':
        newCol = selectedCell.value.column;
        newRow = (selectedCell.value.row + 1) % gameGrid.numRow;
        break;
      case 'LEFT':
        newCol = (selectedCell.value.column - 1) % gameGrid.numCol;
        newRow = selectedCell.value.row;
        break;
      case 'RIGHT':
        newCol = (selectedCell.value.column + 1) % gameGrid.numCol;
        newRow = selectedCell.value.row;
        break;
      case 'UP':
        newCol = selectedCell.value.column;
        newRow = (selectedCell.value.row - 1) % gameGrid.numRow;
        break;
    }
    selectedCell.value = gameGrid.getCell(newRow, newCol);
  }

  function isCellSelected(cell: Cell) {
    if (selectedCell.value == null) {
      return false;
    }
    return selectedCell.value.column === cell.column && selectedCell.value.row === cell.row;
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


  function restart(): void {
    countBombs.value = gameSettings[difficulty.value].numBombs;
    gameGrid.closeAllCells();
  }


  console.log('Game store init completed');
  return {
    countBombs,
    gameGrid,
    gameResult,
    difficulty,
    selectedCell,
    setTutorial,
    setDifficulty,
    selectCell,
    isCellSelected,
    incrementBombs,
    decrementBombs,
    restoreBombs,
    automaticopenCellsAround,
    initGrid,
    openCell,
    openCellsAround,
    endGame,
    numCellFlaggedAround,
    restart,
    gameDuration, createTimer, resetTime, togglePauseTimer
  };

});