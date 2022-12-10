<template>
  <GamePlayboard></GamePlayboard>
</template>

<script setup lang="ts">
import GamePlayboard from "@/components/game/GamePlayboard.vue";
import { FixedGrid } from "@/model/grid/FixedGrid";
import { Difficulty } from "@/model/grid/GameGrid";

const grid: FixedGrid = new FixedGrid(Difficulty.EASY);
</script>
