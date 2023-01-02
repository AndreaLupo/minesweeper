<template>
  <div class="end-game-icon-wrapper">
    <font-awesome-icon
      :icon="`fa-solid ${gameEndData.win ? 'fa-face-smile' : 'fa-face-frown'}`"
      :class="`${gameEndData.win ? 'win' : 'loose'}`"
    />
  </div>

  <div class="buttons">
    <div class="btn" @click="newGame">New game</div>
    <div class="btn" @click="restartGame">Restart this game</div>
    <div class="btn" @click="goToHome">Go to menu</div>
    <div class="btn" @click="closeModal">Back to game</div>
  </div>
</template>

<script setup lang="ts">
import type { GameResultInfo } from "@/model/GameResultInfo";
import router from "@/router";
import { useGameStore } from "@/stores/game";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { toRefs, type PropType } from "vue";

const gameStore = useGameStore();

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

const emit = defineEmits(["closeModal"]);

const { gameEndData, showModal } = toRefs(props);

const newGame = () => {
  location.reload();
};

const closeModal = () => {
  emit("closeModal");
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
.end-game-icon-wrapper {
  text-align: center;
  font-size: 5rem;
  .win {
    color: #4e8c76;
  }
  .loose {
    color: var(--color-accent);
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
