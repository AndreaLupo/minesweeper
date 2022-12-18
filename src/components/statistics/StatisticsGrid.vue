<template>
  <div class="grid">
    <div class="item">
      <div class="title">Win</div>
      <div class="value">{{ difficultyStats.winGames }}</div>
    </div>
    <div class="item">
      <div class="title">Lost</div>
      <div class="value">{{ difficultyStats.lostGames }}</div>
    </div>
    <div class="item">
      <div class="title">Started</div>
      <div class="value">-1</div>
    </div>
    <div class="item">
      <div class="title">Best time</div>
      <div class="value">{{ bestTimeText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore, type DifficultyStats } from "@/stores/statistics";
import { computed, watch, type PropType } from "vue";
import dayjs from "dayjs";
import type { Difficulty } from "@/model/grid/GameGrid";
const statisticsStore = useStatisticsStore();

const props = defineProps({
  difficulty: {
    type: String as PropType<Difficulty>,
    required: true,
  },
});

let difficultyStats: DifficultyStats;

const getStatistics = (difficulty: Difficulty) => {
  difficultyStats = statisticsStore.getStatisticsByDifficulty(difficulty);
};

getStatistics(props.difficulty);

const bestTimeText = computed(() => {
  const bestTime = difficultyStats.bestTime;
  return dayjs().minute(0).second(bestTime).format("mm:ss");
});

watch(
  () => props.difficulty,
  (newDifficulty: Difficulty) => {
    console.log("New value:", newDifficulty);
    getStatistics(newDifficulty);
  }
);
</script>

<style lang="scss">
@import "@/assets/variables.scss";
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
