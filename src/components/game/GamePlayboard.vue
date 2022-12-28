<template>
  <div class="grid">
    <MineModal
      :show="showModal"
      :title="gameEndData.title"
      @close="showModal = false"
      :win="gameEndData.win"
      :fixed="true"
    >
      <p>{{ gameEndData.description }}</p>
      <div class="buttons">
        <div class="btn" @click="newGame">New game</div>
        <div class="btn" @click="restartGame">Restart this game</div>
        <div class="btn" @click="goToHome">Go to menu</div>
        <div class="btn" @click="showModal = false">Back to game</div>
      </div>
    </MineModal>
    <PlayboardCell
      v-for="cell in cellList"
      :key="cell.key"
      :cell="cell"
      @open-empty-adjacent="openEmptyAdjacent"
      @open-cells-around="openCellsAround"
    ></PlayboardCell>
  </div>
</template>

<script setup lang="ts">
import { Cell, CellStatus } from "@/model/Cell";
import { GameResultInfo } from "@/model/GameResultInfo";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import router from "@/router";
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

const gameStore = useGameStore();
const difficulty: Difficulty = localStorage.getItem(
  "currentGameDifficulty"
) as Difficulty;
gameStore.initGrid(difficulty);
const { countBombs, gameGrid, gameResult } = storeToRefs(gameStore);
const showModal = ref(false);

const cssNumColumnFr = computed(function (): string {
  return `repeat(${gameGrid.value.numCol}, 1fr)`;
});

const cellList = computed(function (): Array<Cell> {
  return gameGrid.value.cellList.flatMap((el) => el);
});

const gameEndData = computed(function (): GameResultInfo {
  let result: GameResultInfo;
  if (gameResult.value === GameResult.LOOSE) {
    result = new GameResultInfo("You lost", "Try again.", false);
  } else {
    result = new GameResultInfo("Win!", "Congrats! Well done!", true);
  }
  return result;
});

const gameComplete = computed(() => {
  return (
    gameGrid.value.countOpenCell() === gameGrid.value.totalNumCells &&
    gameGrid.value.checkAllCellsHaveValueFromUser()
  );
});

watch(gameResult, (result: GameResult) => {
  if (result === GameResult.LOOSE) {
    showModal.value = true;
    gameGrid.value.openNotFlaggedCells();
  }
});

watch(countBombs, (bombsCount: number) => {
  isGameEnding();
});
watch(gameComplete, () => {
  isGameEnding();
});

const isGameEnding = (): void => {
  if (countBombs.value === 0 && gameComplete) {
    let result: GameResult;
    if (gameGrid.value.allUserFlagsOnBombs()) {
      result = GameResult.WIN;
    } else {
      result = GameResult.LOOSE;
    }
    showModal.value = true;
    gameStore.endGame(result);
  }
};

const openEmptyAdjacent = (cell: Cell): void => {
  // gameGrid.printDebugGrid();
  gameGrid.value.automaticOpenAdjacentEmptyCell(cell);
  /* 
  doesnt work
  const cellsAround: Cell[] = gameGrid.value.getCellsAround(cell);
  for (const cellAround of cellsAround) {
    cellAround.status = CellStatus.OPEN;
  } */
};

const openCellsAround = (cell: Cell): void => {
  const cells: Cell[] = reactive(gameGrid.value.getCellsAround(cell));
  for (const cell of cells) {
    if (!cell.hasFlag && cell.isBomb) {
      gameResult.value = GameResult.LOOSE;
    } else if (!cell.hasFlag && !cell.isOpen) {
      cell.status = CellStatus.OPEN;
      if (!cell.hasBombsNearby) {
        openCellsAround(cell);
      }
    } else {
      // cell has flag - n
    }
  }
};

const newGame = () => {
  location.reload();
};
const restartGame = () => {
  gameGrid.value.closeAllCells();
  gameResult.value = GameResult.NOT_END;
  gameStore.restoreBombs();
  gameStore.resetTime();
  showModal.value = false;
};
const goToHome = () => {
  router.push("/");
  showModal.value = false;
};

console.log("GamePlayboard created");
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";
.grid {
  display: grid;
  grid-template-columns: v-bind(cssNumColumnFr);
  column-gap: 6px;
  row-gap: 6px;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  .btn {
    display: block;
    width: 50%;
    padding: 1rem;
    border-radius: 5px;
    background-color: $color-primary;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
  }
}

.row {
}
</style>
