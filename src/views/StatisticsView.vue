<template>
  <div class="grid">
    <div class="item">
      <div class="title">Win</div>
      <div class="value">10</div>
    </div>
    <div class="item">
      <div class="title">Lost</div>
      <div class="value">{{lostGames}}</div>
    </div>
    <div class="item">
      <div class="title">Started</div>
      <div class="value">10</div>
    </div>
    <div class="item">
      <div class="title">Best time</div>
      <div class="value">04:12</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatisticsStore } from '@/stores/statistics';
const statisticsStore = useStatisticsStore();
const { lostGames } = statisticsStore;
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
