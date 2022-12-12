<template>
  <div class="timer-wrapper">
    <GameStatus></GameStatus>
  </div>
  <GamePlayboard></GamePlayboard>
</template>

<script setup lang="ts">
import GamePlayboard from "@/components/game/GamePlayboard.vue";
import GameStatus from "@/components/game/GameStatus.vue";
import { FixedGrid } from "@/model/grid/FixedGrid";
import { Difficulty } from "@/model/grid/GameGrid";

const grid: FixedGrid = new FixedGrid(Difficulty.EASY);
</script>

<style scoped lang="scss">
.timer-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}
</style>
