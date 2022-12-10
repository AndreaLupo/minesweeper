<template>
  <div class="cell" v-if="cell.open">
    <span v-if="cell.isBomb">B</span>
    <span v-else-if="cell.numberShown === 0">-</span>
    <span v-else>{{ cell.numberShown }}</span>
  </div>
  <div class="cell cell-closed" v-else @click="openCell"></div>
</template>

<script setup lang="ts">
import { Cell } from "@/model/Cell";
import { computed, isReactive, ref, toRef, toRefs, watch, type Ref } from "vue";

const emit = defineEmits(["endGame"]);

const props = defineProps({
  cell: { type: Cell, required: true },
});
// let open: Ref<boolean> = toRef(props.cell, "open");
console.log(`Is props reactive: ${isReactive(props)}`);

let cell = ref(props.cell);
console.log(`Is cell reactive: ${isReactive(cell)}`);

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
  if (props.cell.isBomb) {
    emit("endGame");
  }
  console.log("Opening");

  cell.value.open = true;
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
}
</style>
