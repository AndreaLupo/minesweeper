<template>
  <div class="wrapper">
    <h1>Minesweeper</h1>
    <RouterLink to="start">New Game</RouterLink>
    <RouterLink to="statistics">Statistics</RouterLink>
    <RouterLink to="tutorial">Tutorial</RouterLink>
    <RouterLink to="settings">Settings</RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
@import "@/assets/mixins.scss";

.wrapper {
  display: flex;
  flex-direction: column;
  width: 25vw;
  align-items: center;

  h1 {
    font-family: $font;
    color: $text-color-bright;
    font-size: 3em;
    margin-bottom: 1rem;
  }

  @include animated-button;
}
</style>
