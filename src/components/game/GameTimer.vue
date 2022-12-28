<template>
  <div>{{ duration }}</div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/game";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const gameStore = useGameStore();
const { gameDuration } = storeToRefs(gameStore);

const duration = computed(() => {
  const minutes = Math.floor(gameDuration.value.seconds / 60);
  const seconds = gameDuration.value.seconds % 60;
  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
});

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}
</script>

<style scoped lang="scss"></style>
