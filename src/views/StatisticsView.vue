<template>
  <div>
    <div class="difficulty-selector">
      <div @click="selectedDifficulty = Difficulty.EASY">EASY</div>
      <div @click="selectedDifficulty = Difficulty.MEDIUM">MEDIUM</div>
      <div @click="selectedDifficulty = Difficulty.DIFFICULT">DIFFICULT</div>
    </div>
    <StatisticsGrid :difficulty="selectedDifficulty"></StatisticsGrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import StatisticsGrid from "@/components/statistics/StatisticsGrid.vue";
import { Difficulty } from "@/model/grid/GameGrid";

const selectedDifficulty = ref(Difficulty.EASY);
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.difficulty-selector {
  display: flex;
  gap: 1rem;

  div {
    padding: 1rem;
    background-color: $color-primary;
    cursor: pointer;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  .item {
    padding: 3rem;
    border-radius: 15px;
    text-align: center;
    background-color: $color-primary;
    .title {
      font-size: medium;
    }
    .value {
      font-size: xx-large;
    }
  }
}
</style>
