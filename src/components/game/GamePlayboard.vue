<template>
  <div class="grid">
    <MineModal
      :show="showModal"
      :title="gameEndData.title"
      @close="showModal = false"
    >
      <p>{{ gameEndData.description }}</p>
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
import { useGameStore } from "@/stores/match";
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

const gameStore = useGameStore();
const route = useRoute();
const difficulty: Difficulty = route.params.difficulty as Difficulty;
gameStore.initGrid(difficulty);
const { countBombs, gameGrid, gameResult } = storeToRefs(gameStore);
const showModal = ref(false);

const cssNumColumnFr = computed(function (): string {
  return `repeat(${gameGrid.value.numCol}, 1fr)`;
});

const cellList = computed(function (): Array<Cell> {
  return gameGrid.value.cellList.flatMap((el) => el);
});

const isGameEnded = computed(function (): boolean {
  return gameResult.value !== GameResult.NOT_END;
});

const gameEndData = computed(function (): GameResultInfo {
  let result: GameResultInfo;
  if (gameResult.value === GameResult.LOOSE) {
    result = new GameResultInfo("You lost", "Try again.");
  } else {
    result = new GameResultInfo("Win!", "Congrats! Well done!");
  }
  return result;
});

watch(gameResult, (result: GameResult) => {
  if (result === GameResult.LOOSE) {
    showModal.value = true;
    gameGrid.value.openNotFlaggedCells();
  }
});

watch(countBombs, (newValue: number) => {
  console.log("Count bombs updated!", newValue);

  if (newValue === 0) {
    let result: GameResult;
    if (gameGrid.value.checkAllCellsHaveValueFromUser()) {
      if (gameGrid.value.allUserFlagsOnBombs()) {
        result = GameResult.WIN;
      } else {
        result = GameResult.LOOSE;
      }
    } else {
      result = GameResult.LOOSE;
      setTimeout(() => {
        if (countBombs.value === 0) {
          window.alert("Some error!");
        }
      }, 2000);
    }
    showModal.value = true;

    gameStore.endGame(result);
  }
});

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
    } else if (!cell.hasFlag) {
      cell.status = CellStatus.OPEN;
    } else {
      // cell has flag - n
    }
  }
};
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: v-bind(cssNumColumnFr);
  column-gap: 6px;
  row-gap: 6px;
}

.row {
}
</style>
