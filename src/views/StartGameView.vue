<template>
  <HomeLink></HomeLink>
  <div class="text">Choose difficulty</div>
  <div class="difficulties">
    <a href="#" @click.prevent="start(Difficulty.EASY)">Easy</a>
    <a href="#" @click.prevent="start(Difficulty.MEDIUM)">Medium</a>
    <a href="#" @click.prevent="start(Difficulty.DIFFICULT)">Hard</a>
  </div>
</template>

<script setup lang="ts">
import HomeLink from "@/components/ui/HomeLink.vue";
import { Difficulty } from "@/model/grid/GameGrid";
import router from "@/router";
import { useRoute } from "vue-router";

const start = (level: Difficulty) => {
  localStorage.setItem("tutorial", "false");
  localStorage.setItem("currentGameDifficulty", level);
  router.replace({ path: `/play` });
};

const route = useRoute();

const difficulty = route.params.difficulty;
if (difficulty) {
  start(difficulty as Difficulty);
}
</script>

<style lang="scss" scoped>
@import "@/assets/themes.scss";
@import "@/assets/mixins.scss";
.text {
  text-align: center;
  font-size: 2em;
  color: var(--text-color-bright);
}
.difficulties {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1rem;
  width: 25vw;

  @media (max-width: 1000px) {
    width: 50vw;
  }

  .diff {
    padding: 1rem;
    text-align: center;
    background-color: var(--color-primary);
    color: var(--text-color);
    border-radius: 10px;
    font-size: 1.2em;
  }
}
@include animated-button;
</style>
