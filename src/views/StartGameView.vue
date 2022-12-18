<template>
  <span class="text">Choose difficulty</span>
  <div class="difficulties">
    <div class="diff" @click="start(Difficulty.EASY)">Easy</div>
    <div class="diff" @click="start(Difficulty.MEDIUM)">Medium</div>
    <div class="diff" @click="start(Difficulty.DIFFICULT)">Hard</div>
  </div>
</template>

<script setup lang="ts">
import { Difficulty } from "@/model/grid/GameGrid";
import router from "@/router";

const start = (level: Difficulty) => {
  // set difficulty in store
  localStorage.setItem("currentGameDifficulty", level);
  router.push({ path: `/play` });
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

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
</style>
