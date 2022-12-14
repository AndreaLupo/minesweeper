import { ref } from "vue";
import { defineStore } from "pinia";

export const useBombCounterStore = defineStore("bombCount", () => {
  const countBombs = ref(10);

  function increment() {
    countBombs.value++;
  }
  function decrement() {
    countBombs.value--;
  }

  return { countBombs, increment, decrement };
});
