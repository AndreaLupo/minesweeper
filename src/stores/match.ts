import { Difficulty } from './../model/grid/GameGrid';
import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { FixedGrid } from "@/model/grid/FixedGrid";
import type { Cell } from '@/model/Cell';

export const useGameStore = defineStore("game", () => {
  const countBombs = ref(10);
  const gameDuration = reactive({ seconds: 0 });

  let gameGrid = reactive(new FixedGrid(Difficulty.EASY));

  const timer = setInterval(() => {
    gameDuration.seconds++;
  }, 1000);

  function incrementBombs(): void {
    countBombs.value++;
  }
  function decrementBombs(): void {
    countBombs.value--;
  }

  function initGrid(difficulty: Difficulty): void {
    gameGrid = new FixedGrid(difficulty);
  }

  function openCellsAround(cell: Cell): void {
    gameGrid.automaticOpenAdjacentEmptyCell(cell);
  }

  function clearTime(): void {
    clearInterval(timer);
  }

  return { countBombs, gameDuration, gameGrid, incrementBombs, decrementBombs, initGrid, openCellsAround };
});