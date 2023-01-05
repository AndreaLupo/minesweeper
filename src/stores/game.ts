import type { SelectDirection } from './../model/SelectDirection';
import { RandomGrid } from '../model/grid/RandomGrid';
import { gameSettings } from '../model/GameSettings';
import { useStatisticsStore } from './statistics';
import { CellStatus } from '../model/Cell';
import { Difficulty, GameResult } from '../model/grid/GameGrid';
import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { FixedGrid } from "../model/grid/FixedGrid";
import type { Cell } from '../model/Cell';
import useTimer from '../composable/timer';


export const useGameStore = defineStore("game", () => {
  // console.log('Init gameStore.');
  const statisticsStore = useStatisticsStore();

  const gameResult = ref(GameResult.NOT_END);

  const currentDifficulty = localStorage.getItem('currentGameDifficulty');
  const difficulty = ref(currentDifficulty === null ? Difficulty.SAMPLE : currentDifficulty as Difficulty);
  const countBombs = ref(gameSettings[difficulty.value].numBombs);

  const firstClick = ref(true);

  const gameGrid = isTutorial() ? reactive(new FixedGrid(Difficulty.TUTORIAL)) : reactive(new RandomGrid(difficulty.value));

  const firstCell = ref<Cell>(gameGrid.getCell(0, 0));
  const selectedCell = firstCell;
  const highlightedCell = ref<Cell | null>(null);
  const { gameDuration, createTimer, resetTime, togglePauseTimer } = useTimer();
  if (isTutorial()) {
    for (const cells of gameGrid.cellList) {
      for (const cell of cells) {
        cell.clickable = false;
      }
    }
  }

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
    difficulty.value = newDifficulty;
    if (isTutorial()) {
      Object.assign(gameGrid, reactive(new FixedGrid(newDifficulty)));
    } else {
      Object.assign(gameGrid, reactive(new RandomGrid(newDifficulty)));
    }
    // gameGrid.printDebugGrid('numbers');
    restoreBombs();
  }

  function openCell(cell: Cell) {
    if (firstClick.value) {
      firstClick.value = false;
      togglePauseTimer();

      if (!isTutorial() && (cell.hasBombsNearby || cell.isBomb)) {
        // change grid so that there's no bomb here and nearby - always random grid if tutorial isn't active
        (gameGrid as RandomGrid).moveBombsInEmptyCells(cell);
      }
    }

    if (CellStatus.FLAGGED === cell.status) {
      // don't have to open cell if the player is wrong!
      return;
    }

    if (cell.isBomb) {
      cell.status = CellStatus.BOOM;
      setTimeout(() => {
        endGame(GameResult.LOST);
      }, 300);
      return;
    }

    if (
      cell.status === CellStatus.OPEN &&
      cell.numberShown === gameGrid.countFlagsAround(cell)
    ) {
      openCellsAround(cell);
    }

    if (!cell.hasBombsNearby) {
      // cell will be opened in automatic cell update
      openCellsAround(cell);
    }
    cell.status = CellStatus.OPEN;
  }

  function openCellsAround(cell: Cell) {
    const cells: Cell[] = reactive(gameGrid.getCellsAround(cell));
    for (const cell of cells) {
      if (!cell.hasFlag && cell.isBomb) {
        gameResult.value = GameResult.LOST;
      } else if (!cell.hasFlag && !cell.isOpen) {
        cell.status = CellStatus.OPEN;
        if (!cell.hasBombsNearby) {
          openCellsAround(cell);
        }
      } else {
        // cell has flag - n
      }
    }
  }

  function setNextCellStatus(cell: Cell) {
    switch (cell.status) {
      case CellStatus.CLOSED:
        cell.status = CellStatus.FLAGGED;
        decrementBombs();
        break;
      case CellStatus.FLAGGED:
        cell.status = CellStatus.QUESTION_MARK;
        incrementBombs();
        break;
      case CellStatus.QUESTION_MARK:
        cell.status = CellStatus.CLOSED;
        break;
      default:
    }
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
        newCol = selectedCell.value.column - 1 >= 0 ? selectedCell.value.column - 1 : gameGrid.numCol - 1;
        newRow = selectedCell.value.row;
        break;
      case 'RIGHT':
        newCol = (selectedCell.value.column + 1) % gameGrid.numCol;
        newRow = selectedCell.value.row;
        break;
      case 'UP':
        newCol = selectedCell.value.column;
        newRow = selectedCell.value.row - 1 >= 0 ? selectedCell.value.row - 1 : gameGrid.numRow - 1;
        break;
    }
    selectedCell.value = gameGrid.getCell(newRow, newCol);
  }

  function selectCellRequested(row: number, column: number) {
    selectedCell.value = gameGrid.getCell(row, column);
  }

  function isCellSelected(cell: Cell) {
    if (selectedCell.value == null) {
      return false;
    }
    return selectedCell.value.column === cell.column && selectedCell.value.row === cell.row;
  }

  function highlightCellRequested(row: number, column: number) {
    highlightedCell.value = gameGrid.getCell(row, column);
  }

  function isCellHighLighted(cell: Cell) {
    if (highlightedCell.value == null) {
      return false;
    }
    return highlightedCell.value.column === cell.column && highlightedCell.value.row === cell.row;
  }


  /**
   * Process the result, stops the timer and update the statistics.
   * @param result 
   * @returns true if there was a best time update.
   */
  function endGame(result: GameResult): boolean {
    //console.log('End game with store!');
    gameResult.value = result;
    togglePauseTimer();
    return statisticsStore.updateStatistics(difficulty.value, result, gameDuration.seconds);
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
    restoreBombs();
    resetTime();
    gameResult.value = GameResult.NOT_END;
    firstClick.value = true;
  }


  // console.log('Game store init completed');
  return {
    countBombs,
    gameGrid,
    gameResult,
    difficulty,
    selectedCell,
    highlightedCell,
    setTutorial,
    setDifficulty,
    selectCell,
    selectCellRequested,
    highlightCellRequested,
    isCellHighLighted,
    isCellSelected,
    incrementBombs,
    decrementBombs,
    restoreBombs,
    initGrid,
    openCell,
    openCellsAround,
    setNextCellStatus,
    endGame,
    numCellFlaggedAround,
    restart,
    gameDuration, createTimer, resetTime, togglePauseTimer
  };

});