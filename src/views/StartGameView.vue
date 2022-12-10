<template>
  <span class="text">Choose difficulty</span>
  <div class="difficulties">
    <div class="diff" @click="start('easy')">Easy</div>
    <div class="diff" @click="start('medium')">Medium</div>
    <div class="diff" @click="start('hard')">Hard</div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

const start = (level: string) => {
  // set difficulty in store
  router.replace("/play");
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.text {
  text-align: center;
  font-size: 2em;
  color: $text-color-bright;
}
.difficulties {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1rem;
  width: 25vw;

  .diff {
    padding: 1rem;
    text-align: center;
    background-color: $color-primary;
    color: $text-color;
    border-radius: 10px;
    font-size: 1.2em;
  }
}
</style>
