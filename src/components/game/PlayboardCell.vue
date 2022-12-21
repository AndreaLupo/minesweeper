<template>
  <div
    class="cell"
    v-if="cell.status !== CellStatus.CLOSED"
    :class="cellClass"
    @click.left="openCell"
    @click.right="goToNextCellStatus"
  >
    <span v-if="cell.status === CellStatus.OPEN && cell.isBomb">
      <font-awesome-icon icon="fa-solid fa-bomb" />
    </span>
    <span
      v-else-if="cell.status === CellStatus.OPEN && !cell.hasBombsNearby"
      class="num-0"
    >
    </span>
    <span
      v-else-if="cell.status === CellStatus.OPEN && cell.hasBombsNearby"
      :class="numberShownClass"
    >
      {{ cell.numberShown }}
    </span>
    <span v-else-if="cell.status === CellStatus.FLAGGED">
      <font-awesome-icon icon="fa-solid fa-flag" />
    </span>
    <span v-else-if="cell.status === CellStatus.QUESTION_MARK">
      <font-awesome-icon icon="fa-solid fa-question" />
    </span>
  </div>
  <div
    v-else
    class="cell cell-closed"
    :class="cellMini"
    @click.left="openCell"
    @click.right="goToNextCellStatus($event)"
  ></div>
</template>

<script setup lang="ts">
import { Cell, CellStatus } from "@/model/Cell";
import { computed, reactive, watch } from "vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBomb, faFlag, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useGameStore } from "@/stores/match";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";

library.add(faBomb);
library.add(faFlag);
library.add(faQuestion);

const gameStore = useGameStore();
/*
console.log("Grid reactive? ", isReactive(gameStore.gameGrid));
console.log("Cells reactive? ", isReactive(gameStore.gameGrid.cellList));
console.log(
  "Status reactive? ",
  isReactive(gameStore.gameGrid.cellList[0][0].status)
);
console.log("Num row reactive? ", isReactive(gameStore.gameGrid.numRow));
*/
const emit = defineEmits(["openEmptyAdjacent", "openCellsAround"]);

const props = defineProps({
  cell: { type: Cell, required: true },
});

let cell = reactive(props.cell);

const cellClass = computed(() => {
  const isZero = !cell.hasBombsNearby;
  let classes: { "num-0": boolean; num: boolean; "cell-mini"?: boolean } = {
    "num-0": isZero,
    num: !isZero,
  };
  classes["cell-mini"] = cellMiniCssClass()["cell-mini"];
  return classes;
});
const cellMini = computed(() => {
  return cellMiniCssClass();
});
function cellMiniCssClass() {
  return {
    "cell-mini": gameStore.gameGrid.difficulty !== Difficulty.EASY,
  };
}

const numberShownClass = computed((): string => {
  return `num num-${cell.numberShown}`;
});

const openCell = () => {
  if (CellStatus.FLAGGED === cell.status) {
    // don't have to open cell if the player is wrong!
    return;
  }

  if (cell.isBomb) {
    cell.status = CellStatus.BOOM;
    setTimeout(() => {
      gameStore.endGame(GameResult.LOOSE);
    }, 300);
  }

  if (
    cell.status === CellStatus.OPEN &&
    cell.numberShown === gameStore.gameGrid.countFlagsAround(cell)
  ) {
    openCellsAround();
  }

  if (!cell.hasBombsNearby) {
    // cell will be opened in automatic cell update
    // emit("openEmptyAdjacent", cell);
    openCellsAround();
    gameStore.openCellsAround(cell);
  } else {
    cell.status = CellStatus.OPEN;
  }
};

const goToNextCellStatus = (event: Event) => {
  event.preventDefault();
  switch (cell.status) {
    case CellStatus.CLOSED:
      cell.status = CellStatus.FLAGGED;
      gameStore.decrementBombs();
      break;
    case CellStatus.FLAGGED:
      cell.status = CellStatus.QUESTION_MARK;
      gameStore.incrementBombs();
      break;
    case CellStatus.QUESTION_MARK:
      cell.status = CellStatus.CLOSED;
      break;
    default:
  }
};

const openCellsAround = () => {
  emit("openCellsAround", cell);
  // gameStore.openCellsAround(cell);
  cell.status = CellStatus.OPEN;
};
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.cell {
  display: flex;
  position: relative;
  padding: 1.4rem;
  background-color: $text-color-bright;
  font-size: 1.4em;
  font-family: "Chakra Petch Bold";
  border-radius: 5px;
  background-color: $color-brown;

  &.cell-mini {
    padding: 1rem;
  }

  &-closed {
    background-color: $color-primary;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
  }

  .fa-flag {
    color: red;
    font-size: 1.3rem;
  }

  .fa-question {
    color: yellow;
    font-size: 1.3rem;
  }

  &.num {
    font-size: 1.8em;
  }

  @mixin num($color) {
    color: $color;
    font-weight: bold;
  }
  .num-1 {
    @include num(#34a9bd);
  }
  .num-2 {
    @include num(#94ba08);
  }
  .num-3 {
    @include num(#53c239);
  }
  .num-4 {
    @include num(#b256bd);
  }
  .num-5 {
    @include num(#ba2416);
  }
}
</style>
