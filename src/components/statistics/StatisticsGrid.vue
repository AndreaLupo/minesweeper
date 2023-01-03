<template>
  <div class="grid">
    <div class="item">
      <div class="title">Win</div>
      <div class="value">{{ difficultyStats.winGames }}</div>
    </div>
    <div class="item">
      <div class="title">Total</div>
      <div class="value">{{ totalGames }}</div>
    </div>
    <div class="item">
      <div class="title">Percentage</div>
      <div class="value">
        {{ totalGames === 0 ? "-" : percentageWinGames + "%" }}
      </div>
    </div>
    <div class="item">
      <div class="title">Best time</div>
      <div class="value">{{ bestTimeText }}</div>
    </div>
    <div class="item">
      <div class="title">Best time date</div>
      <div class="value date">{{ bestTimeDateText }}</div>
    </div>
    <div class="item">
      <div class="title">Total time</div>
      <div class="value">{{ totalTimeText }}</div>
    </div>
    <div class="item">
      <div class="title">Longest win serie</div>
      <div class="value">{{ difficultyStats.series.longestWin }}</div>
    </div>
    <div class="item">
      <div class="title">Longest lost serie</div>
      <div class="value">{{ difficultyStats.series.longestLost }}</div>
    </div>
    <div class="item">
      <div class="title">Current serie</div>
      <div class="value">{{ difficultyStats.series.current }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore, type DifficultyStats } from "@/stores/statistics";
import { computed, isReactive, type ComputedRef, type PropType } from "vue";
import dayjs from "dayjs";
import type { Difficulty } from "@/model/grid/GameGrid";
import { storeToRefs } from "pinia";
const statisticsStore = useStatisticsStore();

const props = defineProps({
  difficulty: {
    type: String as PropType<Difficulty>,
    required: true,
  },
});

const allStats = storeToRefs(statisticsStore);

const getStatistics = (difficulty: Difficulty) => {
  const difficultyStats = allStats.difficultyStats.value[difficulty];
  console.log("Is difficulty stats reactive?", isReactive(difficultyStats));
  return difficultyStats;
};

const difficultyStats: ComputedRef<DifficultyStats> = computed(
  (): DifficultyStats => {
    console.log("Updated", props.difficulty);
    return getStatistics(props.difficulty);
  }
);
getStatistics(props.difficulty);

const bestTimeText = computed(() => {
  const bestTime = difficultyStats.value.bestTime;
  if (bestTime.time === 100000000) {
    return "-";
  }
  return dayjs().minute(0).second(bestTime.time).format("mm:ss");
});

const bestTimeDateText = computed(() => {
  const bestTime = difficultyStats.value.bestTime;
  if (bestTime.when === Date.parse("1/01/1970")) {
    return "-";
  }
  return dayjs(bestTime.when).format("DD/MM/YY HH:mm");
});
const totalTimeText = computed(() => {
  const totalTime = difficultyStats.value.totalTime;
  return dayjs().minute(0).second(totalTime).format("mm:ss");
});

const totalGames = computed(() => {
  return difficultyStats.value.winGames + difficultyStats.value.lostGames;
});
const percentageWinGames = computed(() => {
  const percentage =
    (Math.round((difficultyStats.value.winGames / totalGames.value) * 100) /
      100) *
    100;
  return percentage.toFixed(2);
});
</script>

<style lang="scss">
@import "@/assets/themes.scss";
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: flex-start;
  gap: 1rem;

  .item {
    padding: 2rem;
    border-radius: 15px;
    text-align: center;

    background-color: var(--color-primary);
    .title {
      font-size: medium;
    }
    .value {
      font-size: xx-large;

      &.date {
        font-size: large;
      }
    }
  }
}
</style>
