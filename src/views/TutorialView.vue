<template>
  <HomeLink></HomeLink>
  <div class="tutorial">
    <div class="help-column">
      <transition name="text" mode="out-in">
        <span class="tutorial-text" :key="currentStep.text">{{
          currentStep.text
        }}</span>
      </transition>
      <span v-if="showNext" class="next" @click="goToNextStep">Next</span>
    </div>
    <div class="playboard">
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
      gameStore.highlightCellRequested(0, 0);
      break;
    case 3:
      gameStore.highlightCellRequested(2, 1);
      break;
    case 4:
      gameStore.highlightCellRequested(2, 2);
      break;
    case 5:
      gameStore.highlightCellRequested(2, 3);
      break;
    case 6:
      gameStore.highlightCellRequested(0, 3);
      break;
    case 7:
      gameStore.highlightCellRequested(4, 3);
      break;
    case 8:
      gameStore.highlightCellRequested(2, 3);
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

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  .help-column {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    @media (max-width: 700px) {
      grid-row: 2;
      margin: 1rem 0 1rem 0;
    }
  }

  &-text {
    font-size: 1.8rem;
  }

  .next {
    cursor: pointer;
    align-self: flex-end;
  }

  .text-enter-active {
    transition: all 0.3s ease-out;
  }
  .text-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .text-enter-from {
    transform: translateX(-40px);
    opacity: 0;
  }

  .text-leave-to {
    transform: translateX(40px);
    opacity: 0;
  }

  .playboard {
    @media (max-width: 1200px) {
      margin: 0 4rem;
    }

    @media (max-width: 1000px) {
      margin: 0 1rem;
    }

    @media (max-width: 1000px) {
      margin: 0;
    }

    @media (max-width: 700px) {
      grid-row: 1;
      margin: 0 6rem;
    }

    @media (max-width: 550px) {
      margin: 0 4rem;
    }
  }
}
</style>
