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
import { computed, isReactive, ref, toRef, toRefs, watch, type Ref } from "vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFlag, faQuestion } from "@fortawesome/free-solid-svg-icons";

library.add(faFlag);
library.add(faQuestion);

const emit = defineEmits(["endGame", "openEmptyAdjacent"]);

const props = defineProps({
  cell: { type: Cell, required: true },
});

let cell = ref(props.cell);

const cellClass = computed(() => {
  const isZero = !cell.value.hasBombsNearby;
  return { "num-0": isZero, num: !isZero };
});
const numberShownClass = computed((): string => {
  return `num num-${cell.value.numberShown}`;
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
  if (cell.value.isBomb) {
    cell.value.status = CellStatus.BOOM;
    emit("endGame");
  }
  console.log("Opening");

  if (!cell.value.hasBombsNearby) {
    // cell will be opened in automatic cell update
    emit("openEmptyAdjacent", cell.value);
  } else {
    cell.value.status = CellStatus.OPEN;
  }
};

const goToNextCellStatus = (event: Event) => {
  event.preventDefault();
  switch (cell.value.status) {
    case CellStatus.CLOSED:
      cell.value.status = CellStatus.FLAGGED;
      break;
    case CellStatus.FLAGGED:
      cell.value.status = CellStatus.QUESTION_MARK;
      break;
    case CellStatus.QUESTION_MARK:
      cell.value.status = CellStatus.CLOSED;
      break;
    default:
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.cell {
  display: flex;
  padding: 1rem 1.2rem;
  background-color: $text-color-bright;
  font-size: 1.4em;
  font-weight: bold;

  &-closed {
    padding: 1.4rem;
    background-color: $color-primary;
  }

  .fa-flag {
    color: red;
    font-size: 1.4em;
  }

  .fa-question {
    color: yellow;
    font-size: 1.4em;
  }

  &.num {
    padding: 8px 1rem;
    font-size: 1.3em;
  }

  &.num-0 {
    background-color: $color-brown;
  }

  .num-1 {
    color: #34a9bd;
    font-weight: bold;
  }
  .num-2 {
    color: #94ba08;
    font-weight: bold;
  }
  .num-3 {
    color: #53c239;
    font-weight: bold;
  }
}
</style>
