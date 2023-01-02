<template>
  <HomeLink></HomeLink>
  <div class="tutorial">
    <div class="help-column">
      <span class="tutorial-text">{{ currentStep.text }}</span>
      <span v-if="showNext" class="next" @click="goToNextStep">Next</span>
    </div>
    <div>
      <GamePlayboard></GamePlayboard>
    </div>
    <div></div>
  </div>
</template>
<script setup lang="ts">
import GamePlayboard from "@/components/game/GamePlayboard.vue";
import HomeLink from "@/components/ui/HomeLink.vue";
import { Difficulty } from "@/model/grid/GameGrid";
import { steps, type Step } from "@/model/TutorialSteps";
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
const gameStore = useGameStore();
gameStore.setTutorial(true);
gameStore.setDifficulty(Difficulty.TUTORIAL);

const selectedStep = ref(0);
const { gameGrid } = storeToRefs(gameStore);

const goToNextStep = () => {
  if (selectedStep.value === steps.length - 1) {
    return;
  }
  selectedStep.value++;
  switch (selectedStep.value) {
    case 1:
      gameStore.selectCellRequested(0, 0);
      break;
    case 3:
      gameStore.selectCellRequested(2, 1);
      break;
    case 4:
      gameStore.selectCellRequested(2, 2);
      break;
    case 5:
      gameStore.selectCellRequested(2, 3);
      break;
    case 6:
      gameStore.selectCellRequested(0, 3);
      break;
    case 7:
      gameStore.selectCellRequested(4, 3);
      break;
    case 8:
      gameStore.selectCellRequested(2, 3);
      break;
  }
};

const currentStep = computed((): Step => {
  return steps.find((el) => el.index === selectedStep.value)!;
});

const showNext = computed((): boolean => {
  return selectedStep.value < steps.length - 1;
});
</script>

<style scoped lang="scss">
@import "@/assets/themes.scss";
.tutorial {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 2rem;
  color: var(--text-color-bright);

  .help-column {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  &-text {
    font-size: 1.8rem;
  }

  .next {
    cursor: pointer;
    align-self: flex-end;
  }
}
</style>
