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
import { useStatisticsStore, type DifficultyStats } from "@/stores/statistics";
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
import StatisticsGrid from "@/components/statistics/StatisticsGrid.vue";
import { useGameStore } from "@/stores/match";
import { Difficulty } from "@/model/grid/GameGrid";
const statisticsStore = useStatisticsStore();
const { lostGames, winGames, bestTime } = statisticsStore.difficultyStats;

const selectedDifficulty = ref(Difficulty.EASY);

const bestTimeText = computed(() => {
  console.log(bestTime);
  return dayjs().minute(0).second(bestTime).format("mm:ss");
});
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
