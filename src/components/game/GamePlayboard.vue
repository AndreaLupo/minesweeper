<template>
  <div class="grid" @keydown="manageKeyboardInput">
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
    ></PlayboardCell>
  </div>
  <input
    class="hidden-input"
    @keydown="manageKeyboardInput"
    autofocus
    ref="keyDetector"
  />
</template>

<script setup lang="ts">
import type { Cell } from "@/model/Cell";
import { GameResultInfo } from "@/model/GameResultInfo";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import type { InputFocusable } from "@/model/InputFocusable";
import router from "@/router";
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

const gameStore = useGameStore();
const difficulty: Difficulty = localStorage.getItem(
  "currentGameDifficulty"
) as Difficulty;
gameStore.initGrid(difficulty);
const { countBombs, gameGrid, gameResult } = storeToRefs(gameStore);
const showModal = ref(false);
// null for initial value, focus for input

const keyDetector = ref<InputFocusable>(null);

console.log(gameGrid.value.numCol);

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

onMounted(() => {
  const timer = setInterval(() => {
    // set focus on hidden input. 1 second is enough since the user requires some time to switch from mouse to keyboard.
    if (keyDetector.value) {
      keyDetector.value.focus();
    }
  }, 1000);
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

const manageKeyboardInput = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowUp":
      gameStore.selectCell("UP");
      break;
    case "ArrowDown":
      gameStore.selectCell("DOWN");
      break;
    case "ArrowLeft":
      gameStore.selectCell("LEFT");
      break;
    case "ArrowRight":
      gameStore.selectCell("RIGHT");
      break;
    case "Space":
      gameStore.openCell(gameStore.selectedCell);
      break;
    case "KeyB":
      gameStore.setNextCellStatus(gameStore.selectedCell);
      break;
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

.hidden-input {
  opacity: 0;
}
</style>
