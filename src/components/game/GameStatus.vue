<template>
  <div class="wrapper">
    <GameTimer></GameTimer>
    <div><font-awesome-icon icon="fa-solid fa-bomb" /> {{ countBombs }}</div>
  </div>
</template>

<script setup lang="ts">
import GameTimer from "./GameTimer.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";

const gameStore = useGameStore();
library.add(faBomb);

const { countBombs, gameDuration } = storeToRefs(gameStore);
</script>

<style scoped lang="scss">
@import "@/assets/themes.scss";
.wrapper {
  display: flex;
  gap: 1rem;
  background-color: var(--color-primary);
  padding: 0.6rem;
  border: 4px solid $color-brown;
  border-radius: 15px;
  font-size: 1.8em;
}
</style>
