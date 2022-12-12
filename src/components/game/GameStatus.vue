<template>
  <div class="wrapper">
    <GameTimer></GameTimer>
    <div><font-awesome-icon icon="fa-solid fa-bomb" /> 10</div>
  </div>
</template>

<script setup lang="ts">
import GameTimer from "./GameTimer.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";

library.add(faBomb);
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";
.wrapper {
  display: flex;
  gap: 1rem;
  background-color: $color-primary;
  padding: 1rem;
  border: 4px solid $color-brown;
  border-radius: 15px;
  font-size: 1.8em;
}
</style>
