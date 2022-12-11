<template>
  <div class="grid">
    <MineModal :show="$dial.showDialog" title="You lost!"> </MineModal>
    <PlayboardCell
      v-for="cell in cellList"
      :key="cell.key"
      :cell="cell"
      @end-game="endGame"
      @open-empty-adjacent="openEmptyAdjacent"
    ></PlayboardCell>
  </div>
</template>

<script setup lang="ts">
import type { Cell } from "@/model/Cell";
import { FixedGrid } from "@/model/grid/FixedGrid";
import { Difficulty } from "@/model/grid/GameGrid";
import { computed, reactive, toRef } from "vue";
import MineModal from "../ui/MineModal.vue";
import PlayboardCell from "./PlayboardCell.vue";

const gameGrid: FixedGrid = new FixedGrid(Difficulty.EASY);
const $dial = reactive({ showDialog: false });

const cssNumColumnFr = computed(function (): string {
  return `repeat(${gameGrid.numCol}, 1fr)`;
});
const cssNumRowFr = computed(function (): string {
  return `repeat(${gameGrid.numRow}, 1fr)`;
});

const cellList = computed(function (): Array<Cell> {
  return gameGrid.cellList.flatMap((el) => el);
});

const endGame = (): void => {
  $dial.showDialog = true;
};
const openEmptyAdjacent = (cell: Cell): void => {
  // gameGrid.printDebugGrid();
  gameGrid.automaticOpenAdjacentEmptyCell(cell);
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
