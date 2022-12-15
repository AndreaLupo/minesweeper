<template>
  <div class="grid">
    <MineModal :show="isGameEnded" title="You lost!"> </MineModal>
    <PlayboardCell
      v-for="cell in cellList"
      :key="cell.key"
      :cell="cell"
      @end-game="clickOnBomb"
      @open-empty-adjacent="openEmptyAdjacent"
      @open-cells-around="openCellsAround"
    ></PlayboardCell>
  </div>
</template>

<script setup lang="ts">
import { Cell, CellStatus } from "@/model/Cell";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import { useGameStore } from "@/stores/match";
import { useStatisticsStore } from "@/stores/statistics";
import { storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

const gameStore = useGameStore();
const statisticsStore = useStatisticsStore();
gameStore.initGrid(Difficulty.EASY);
const { gameGrid, gameResult } = storeToRefs(gameStore);

const cssNumColumnFr = computed(function (): string {
  return `repeat(${gameGrid.value.numCol}, 1fr)`;
});

const cellList = computed(function (): Array<Cell> {
  return gameGrid.value.cellList.flatMap((el) => el);
});

const isGameEnded = computed(function (): boolean {
  return gameResult.value !== GameResult.NOT_END;
});

const clickOnBomb = (): void => {
  gameResult.value = GameResult.LOOSE;
  gameStore.togglePauseTimer();
  statisticsStore.incrementLostGames();
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
