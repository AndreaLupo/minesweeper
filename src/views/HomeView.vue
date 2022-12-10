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

  a:link {
    width: 100%;
    background-color: $color-primary;
    color: $text-color;
    font-family: inherit;
    text-decoration: none;
    text-align: center;
    font-size: 1.3em;
    padding: 1rem;
    border: 0px;
    margin-bottom: 4px;
    border-radius: 15px;
    cursor: pointer;
  }

  a:hover,
  a:active {
    background-color: $color-primary-bright;
    border: 4px solid $color-secondary;
    margin: 3px;
    transform: scale(1.1);
  }
}
</style>
