<template>
  <div class="grid" @keydown="manageKeyboardInput">
    <MineModal
      :show="showModal"
      :title="gameEndData.title"
      @close="showModal = false"
      :win="gameEndData.win"
      :fixed="true"
      :hide-header="true"
    >
      <EndgameModalContent
        :game-end-data="gameEndData"
        :show-modal="showModal"
        @close-modal="showModal = false"
      ></EndgameModalContent>
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
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faFaceFrown, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import EndgameModalContent from "./EndgameModalContent.vue";

library.add(faFaceFrown);
library.add(faFaceSmile);

const gameStore = useGameStore();
const difficulty: Difficulty = localStorage.getItem(
  "currentGameDifficulty"
) as Difficulty;
gameStore.initGrid(difficulty);
const { countBombs, gameGrid, gameResult } = storeToRefs(gameStore);
const showModal = ref(false);

// useful when end a match and start a new one passing from menu
gameStore.restart();

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

console.log("GamePlayboard created");
</script>

<style scoped lang="scss">
@import "@/assets/themes.scss";
.grid {
  display: grid;
  grid-template-columns: v-bind(cssNumColumnFr);
  column-gap: 6px;
  row-gap: 6px;
}

.hidden-input {
  opacity: 0;
}
</style>
