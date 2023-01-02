<template>
  <HomeLink></HomeLink>
  <div class="intro">
    <span class="intro--text"
      >Here you can find some statistics for each difficulty.</span
    >
  </div>
  <div class="wrapper">
    <div class="difficulty-selector">
      <div
        @click="select(options[0])"
        :class="options[0].isSelected ? 'selected' : ''"
      >
        EASY
      </div>
      <div
        @click="select(options[1])"
        :class="options[1].isSelected ? 'selected' : ''"
      >
        MEDIUM
      </div>
      <div
        @click="select(options[2])"
        :class="options[2].isSelected ? 'selected' : ''"
      >
        DIFFICULT
      </div>
    </div>
    <StatisticsGrid
      :difficulty="selectedDifficulty.difficulty"
    ></StatisticsGrid>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import StatisticsGrid from "@/components/statistics/StatisticsGrid.vue";
import { Difficulty } from "@/model/grid/GameGrid";
import HomeLink from "@/components/ui/HomeLink.vue";
type DifficultyOption = { difficulty: Difficulty; isSelected: boolean };

const options: DifficultyOption[] = reactive([
  {
    difficulty: Difficulty.EASY,
    isSelected: true,
  },
  {
    difficulty: Difficulty.MEDIUM,
    isSelected: false,
  },
  {
    difficulty: Difficulty.DIFFICULT,
    isSelected: false,
  },
]);

const select = (difficultyOption: DifficultyOption) => {
  for (const option of options) {
    option.isSelected = false;
  }

  difficultyOption.isSelected = true;
};

const selectedDifficulty = computed(() => {
  return options.find((el) => el.isSelected)!;
});
</script>

<style scoped lang="scss">
@import "@/assets/themes.scss";

.intro {
  margin-bottom: 4rem;
  &--text {
    font-size: 1.4em;
    color: var(--text-color-bright);
  }
}

.wrapper {
  display: flex;
  gap: 1rem;

  .difficulty-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;

    div {
      //background-color: $color-primary;
      color: var(--color-primary-bright);
      cursor: pointer;
      text-align: center;
      padding: 4px 1rem;

      &.selected {
        border-right: 4px solid var(--color-primary);
        background-color: rgba(var(--color-primary), 0.4);
      }
    }
  }
}
</style>
