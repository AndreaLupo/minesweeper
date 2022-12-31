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
    :class="closedCssClass"
    @click.left="openCell"
    @click.right="goToNextCellStatus($event)"
  ></div>
</template>

<script setup lang="ts">
import { Cell, CellStatus } from "@/model/Cell";
import { computed, isReactive, reactive, ref, watch } from "vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBomb, faFlag, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useGameStore } from "@/stores/game";
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import { storeToRefs } from "pinia";

library.add(faBomb);
library.add(faFlag);
library.add(faQuestion);

const gameStore = useGameStore();

/* console.log("Grid reactive? ", isReactive(gameStore.gameGrid));
console.log("Cells reactive? ", isReactive(gameStore.gameGrid.cellList));
console.log("Cell reactive? ", isReactive(gameStore.gameGrid.cellList[0][0]));
console.log(
  "Status reactive? ",
  isReactive(gameStore.gameGrid.cellList[0][0].status)
);
console.log("Num row reactive? ", isReactive(gameStore.gameGrid.numRow)); */

const { selectedCell, gameResult } = storeToRefs(gameStore);
const selected = reactive({ isSelected: false });

const props = defineProps({
  cell: { type: Cell, required: true },
});

// console.log("Prop cell reactive?", isReactive(props.cell));
let cell = reactive(props.cell);

const cellClass = computed(() => {
  const isZero = !cell.hasBombsNearby;
  let classes: {
    "num-0": boolean;
    num: boolean;
    "cell-mini"?: boolean;
    "cell-maxi"?: boolean;
    selected?: boolean;
  } = {
    "num-0": isZero,
    num: !isZero,
  };
  classes["cell-mini"] = cellMiniCssClass()["cell-mini"];
  classes["cell-maxi"] = cellMaxiCssClass()["cell-maxi"];
  classes["selected"] = isSelected()["selected"];
  return classes;
});
const closedCssClass = computed(() => {
  return {
    ...cellMiniCssClass(),
    ...cellMaxiCssClass(),
    ...isSelected(),
    ...hasWrongFlagClass(),
  };
});

const numberShownClass = computed((): string => {
  return `num num-${cell.numberShown}`;
});

const isWrongFlag = computed((): boolean => {
  console.log("Ehy!");
  return gameResult.value === GameResult.LOOSE && cell.hasFlag && !cell.isBomb;
});

watch(selectedCell, () => {
  if (gameStore.isCellSelected(cell)) {
    // add class selected
    selected.isSelected = true;
  } else {
    // remove class selected
    selected.isSelected = false;
  }
});

function cellMiniCssClass() {
  return {
    "cell-mini": gameStore.gameGrid.difficulty !== Difficulty.EASY,
  };
}
function cellMaxiCssClass() {
  return {
    "cell-maxi": gameStore.gameGrid.difficulty === Difficulty.TUTORIAL,
  };
}

function isSelected() {
  return {
    selected: selected.isSelected,
  };
}
function hasWrongFlagClass() {
  return {
    "wrong-flag": isWrongFlag,
  };
}

const openCell = () => {
  if (cell.clickable && gameResult.value === GameResult.NOT_END) {
    gameStore.openCell(cell);
  }
};

const goToNextCellStatus = (event: Event) => {
  event.preventDefault();
  if (gameResult.value === GameResult.NOT_END) {
    gameStore.setNextCellStatus(cell);
  }
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
  background-color: $color-primary-bright;

  &.cell-mini {
    padding: 1rem;
  }

  &.cell-maxi {
    padding: 2rem 1.4rem;
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

  &.selected {
    // transform: scale(1.2);
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 3px $color-accent;
    background-color: $color-primary-bright;
  }

  .wrong-flag {
    background-color: $color-accent;
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
