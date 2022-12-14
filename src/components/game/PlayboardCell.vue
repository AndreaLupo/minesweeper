<template>
  <div
    class="cell"
    v-if="cell.status !== CellStatus.CLOSED"
    :class="cellClass"
    @click.left="openCell"
    @click.right="goToNextCellStatus"
  >
    <span v-if="cell.status === CellStatus.OPEN && cell.isBomb">B</span>
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
    @click.left="openCell"
    @click.right="goToNextCellStatus($event)"
  ></div>
</template>

<script setup lang="ts">
import { Cell, CellStatus } from "@/model/Cell";
import {
  computed,
  isReactive,
  reactive,
  ref,
  toRef,
  toRefs,
  watch,
  type Ref,
} from "vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFlag, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useBombCounterStore } from "@/stores/counter";

library.add(faFlag);
library.add(faQuestion);

const bombStore = useBombCounterStore();

const emit = defineEmits(["endGame", "openEmptyAdjacent", "openCellsAround"]);

const props = defineProps({
  cell: { type: Cell, required: true },
});

let cell = reactive(props.cell);

const cellClass = computed(() => {
  const isZero = !cell.hasBombsNearby;
  return { "num-0": isZero, num: !isZero };
});
const numberShownClass = computed((): string => {
  return `num num-${cell.numberShown}`;
});

watch(
  () => open,
  (first, second) => {
    console.log(
      "Watch props.selected function called with args:",
      first,
      second
    );
  }
);

const openCell = () => {
  if (cell.isBomb) {
    cell.status = CellStatus.BOOM;
    emit("endGame");
  }
  console.log("Opening, current status:", cell.status);

  if (!cell.hasBombsNearby) {
    // cell will be opened in automatic cell update
    // emit("openEmptyAdjacent", cell);
  } else {
    // cell.status = CellStatus.OPEN;
  }
  cell.status = CellStatus.OPEN;
};

const goToNextCellStatus = (event: Event) => {
  event.preventDefault();
  switch (cell.status) {
    case CellStatus.CLOSED:
      cell.status = CellStatus.FLAGGED;
      bombStore.decrement();
      break;
    case CellStatus.FLAGGED:
      cell.status = CellStatus.QUESTION_MARK;
      bombStore.increment();
      break;
    case CellStatus.QUESTION_MARK:
      cell.status = CellStatus.CLOSED;
      break;
    default:
  }
};

const openCellsAround = () => {
  emit("openCellsAround", cell);
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
  font-weight: bold;

  &-closed {
    background-color: $color-primary;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .fa-flag {
    color: red;
  }

  .fa-question {
    color: yellow;
  }

  &.num {
    padding: 8px 1rem;
    font-size: 1.3em;
  }

  &.num-0 {
    background-color: $text-color-bright;
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
}
</style>
