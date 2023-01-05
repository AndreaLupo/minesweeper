<template>
  <div class="end-game-icon-wrapper">
    <font-awesome-icon
      icon="fa-solid fa-xmark"
      class="close-icon"
      @click="closeModal"
    ></font-awesome-icon>

    <font-awesome-icon
      :icon="`fa-solid ${icon}`"
      :class="`icon ${gameEndData.win ? 'win' : 'loose'} ${
        gameEndData.newRecord ? 'record' : ''
      }`"
    />
    <span
      class="description"
      :class="`${gameEndData.newRecord ? 'record' : ''}`"
      >{{ gameEndData.description }}</span
    >
  </div>

  <div class="buttons">
    <div v-if="!isTutorial" class="btn" @click="newGame">New game</div>
    <div v-if="!isTutorial" class="btn" @click="changeDifficulty">
      Change difficulty
    </div>
    <div class="btn" @click="restartGame">Restart this game</div>
    <div class="btn" @click="goToHome">Go to menu</div>
  </div>
</template>

<script setup lang="ts">
import type { GameResultInfo } from "@/model/GameResultInfo";
import router from "@/router";
import { useGameStore } from "@/stores/game";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFaceFrown,
  faFaceSmile,
  faHourglassStart,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { computed, onMounted, toRefs, type PropType } from "vue";
import { storeToRefs } from "pinia";
import { Difficulty } from "@/model/grid/GameGrid";

const gameStore = useGameStore();
library.add(faFaceFrown);
library.add(faFaceSmile);
library.add(faHourglassStart);
library.add(faXmark);

const props = defineProps({
  gameEndData: {
    type: Object as PropType<GameResultInfo>,
    required: true,
  },
  showModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closeModal", "openCells"]);

const { gameEndData, showModal } = toRefs(props);
const { difficulty } = storeToRefs(gameStore);

const icon = computed(() => {
  if (gameEndData.value.win) {
    if (gameEndData.value.newRecord) {
      return "fa-hourglass-start";
    } else {
      return "fa-face-smile";
    }
  } else {
    return "fa-face-frown";
  }
});

const isTutorial = computed(() => {
  return difficulty.value === Difficulty.TUTORIAL;
});

const newGame = () => {
  location.reload();
};

const closeModal = () => {
  emit("closeModal");
  emit("openCells");
};
const changeDifficulty = () => {
  router.push("/start");
  closeModal();
};

const restartGame = () => {
  gameStore.restart();
  closeModal();
};
const goToHome = () => {
  router.push("/");
  closeModal();
};
</script>

<style scoped lang="scss">
@keyframes shake-and-rotate {
  25% {
    transform: rotate(180deg) scale(1.2);
  }
  50% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes zoom-in-out {
  30% {
    transform: scale(1.3);
  }
  60% {
    transform: scale(1);
  }
  90% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.end-game-icon-wrapper {
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 5rem;

  .close-icon {
    cursor: pointer;
    position: absolute;
    right: 0.4em;
    font-size: 0.2em;
    color: var(--color-primary);
    z-index: 10;
  }

  .icon {
    &.win {
      color: #4e8c76;
    }
    &.loose {
      color: var(--color-accent);
    }
    &.record {
      animation: shake-and-rotate 1.5s ease-in;
    }
  }

  .best-time {
    transform: rotateX(45deg);
  }

  .description {
    font-size: 1.4rem;
    color: var(--text-color-bright);
    margin: 1rem 0;

    &.record {
      animation: zoom-in-out 1s ease-in;
    }
  }
}

.buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  padding: 1rem;
  gap: 4px;
  .btn {
    display: block;
    padding: 1rem;
    border-radius: 5px;
    background-color: var(--color-primary);
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
  }
}
</style>
