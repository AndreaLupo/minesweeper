<template>
  <div class="grid">
    <MineModal
      :show="showModal"
      @close="showModal = false"
      :win="gameEndData.win"
      :fixed="true"
      :hide-header="true"
    >
      <EndgameModalContent
        :game-end-data="gameEndData"
        :show-modal="showModal"
        @close-modal="showModal = false"
        @open-cells="openClosedCells"
      ></EndgameModalContent>
    </MineModal>
    <PlayboardCell
      v-for="cell in cellList"
      :key="cell.key"
      :cell="cell"
    ></PlayboardCell>
  </div>

  <KeyboardEventListener
    @keyboard-input="manageKeyboardInput"
  ></KeyboardEventListener>
</template>

<script setup lang="ts">
import type { Cell } from "@/model/Cell";
import { GameResultInfo } from "@/model/GameResultInfo";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed, ref, watch, type Ref } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

import EndgameModalContent from "./EndgameModalContent.vue";
import KeyboardEventListener from "../ui/KeyboardEventListener.vue";
import type AvailableKeyboardEvent from "@/model/keyboard/AvailableKeyboardEvents";

const gameStore = useGameStore();
const difficulty: Difficulty = localStorage.getItem(
  "currentGameDifficulty"
) as Difficulty;
gameStore.initGrid(difficulty);
const { countBombs, gameGrid, gameResult } = storeToRefs(gameStore);
const showModal: Ref<boolean> = ref(false);
const newRecord: Ref<boolean | null> = ref(null);

// useful when end a match and start a new one passing from menu
gameStore.restart();

const cssNumColumnFr = computed(function (): string {
  return `repeat(${gameGrid.value.numCol}, 1fr)`;
});

const cellList = computed(function (): Array<Cell> {
  return gameGrid.value.cellList.flatMap((el) => el);
});

const gameEndData = computed(function (): GameResultInfo {
  let result: GameResultInfo;
  if (gameResult.value === GameResult.LOST) {
    result = new GameResultInfo("Oh, no!", false, false);
  } else {
    let message = "";
    if (newRecord.value) {
      message = "You improved your best time!";
    } else {
      message = "You rock!";
    }
    result = new GameResultInfo(message, true, newRecord.value!);
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
  if (result === GameResult.LOST) {
    showModal.value = true;
  }
});

watch(countBombs, () => {
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
      result = GameResult.LOST;
    }
    showModal.value = true;
    newRecord.value = gameStore.endGame(result);
  }
};

const manageKeyboardInput = (event: AvailableKeyboardEvent) => {
  if (gameResult.value !== GameResult.NOT_END) {
    return;
  }
  switch (event) {
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

const openClosedCells = () => {
  gameGrid.value.openNotFlaggedCells();
};
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
