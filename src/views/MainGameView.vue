<template>
  <div class="timer-wrapper" :class="additional">
    <GameStatus></GameStatus>
  </div>
  <GamePlayboard></GamePlayboard>
</template>

<script setup lang="ts">
import GamePlayboard from "@/components/game/GamePlayboard.vue";
import GameStatus from "@/components/game/GameStatus.vue";
import { Difficulty } from "@/model/grid/GameGrid";
import { useGameStore } from "@/stores/match";
import { computed, ref } from "vue";
const gameStore = useGameStore();

const difficulty = ref(gameStore.difficulty);

const additional = computed(() => {
  return { "mini-margin": difficulty.value !== Difficulty.EASY };
});
</script>

<style scoped lang="scss">
.timer-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;

  &.mini-margin {
    margin-bottom: 1rem;
  }
}
</style>
