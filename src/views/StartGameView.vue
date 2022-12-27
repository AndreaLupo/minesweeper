<template>
  <span class="text">Choose difficulty</span>
  <div class="difficulties">
    <a href="#" @click.prevent="start(Difficulty.EASY)">Easy</a>
    <a href="#" @click.prevent="start(Difficulty.MEDIUM)">Medium</a>
    <a href="#" @click.prevent="start(Difficulty.DIFFICULT)">Hard</a>
  </div>
</template>

<script setup lang="ts">
import { Difficulty } from "@/model/grid/GameGrid";
import router from "@/router";
import { useGameStore } from "@/stores/match";
const gameStore = useGameStore();

const start = (level: Difficulty) => {
  // set difficulty in store
  console.log("Start!");
  gameStore.setDifficulty(level);
  gameStore.setTutorial(false);
  router.replace({ path: `/play` });
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
@import "@/assets/mixins.scss";
.text {
  text-align: center;
  font-size: 2em;
  color: $text-color-bright;
}
.difficulties {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1rem;
  width: 25vw;

  .diff {
    padding: 1rem;
    text-align: center;
    background-color: $color-primary;
    color: $text-color;
    border-radius: 10px;
    font-size: 1.2em;
  }
}
@include animated-button;
</style>
