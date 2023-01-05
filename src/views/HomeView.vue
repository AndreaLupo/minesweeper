<template>
  <div class="wrapper">
    <h1>Minesweeper</h1>
    <RouterLink class="margin" to="start">New Game</RouterLink>
    <RouterLink class="margin" to="statistics">Statistics</RouterLink>
    <RouterLink class="margin" to="tutorial">Tutorial</RouterLink>
    <RouterLink class="margin" to="settings">Settings</RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
@import "@/assets/themes.scss";
@import "@/assets/mixins.scss";

.wrapper {
  display: flex;
  flex-direction: column;
  width: 25vw;
  align-items: center;

  h1 {
    font-family: $font;
    color: var(--text-color-bright);
    font-size: 3em;
    margin-bottom: 1rem;
  }

  @media (max-width: 1000px) {
    width: 50vw;
  }

  @include animated-button;

  a.margin {
    margin-bottom: 8px;
  }
}
</style>
