<template>
  <div class="tutorial">
    <div>
      <a href="/">Go to home</a>

      <span class="tutorial-text"
        >First, you have to click on a cell to open it!</span
      >
    </div>
    <div>
      <GamePlayboard></GamePlayboard>
    </div>
    <div></div>
  </div>
</template>
<script setup lang="ts">
import GamePlayboard from "@/components/game/GamePlayboard.vue";
import { Difficulty } from "@/model/grid/GameGrid";
import { useGameStore } from "@/stores/game";
const gameStore = useGameStore();
gameStore.setTutorial(true);
gameStore.setDifficulty(Difficulty.EASY);
</script>

<style scoped lang="scss">
.tutorial {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 2rem;

  &-text {
    font-size: 1.8rem;
  }
}
</style>
