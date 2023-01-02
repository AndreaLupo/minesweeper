import { Difficulty } from "@/model/grid/GameGrid";
import { defineStore } from "pinia";
import { reactive } from "vue";

export interface DifficultyStats {
  lostGames: number;
  winGames: number;
  bestTime: number;
}


export const useStatisticsStore = defineStore("statistics", () => {

  const storageDiff = localStorage.getItem('currentGameDifficulty') as Difficulty;
  const difficulty = storageDiff ? storageDiff : Difficulty.EASY;

  const getFromLocalStorage = function (difficulty: Difficulty, defaults?: DifficultyStats): DifficultyStats {
    const storage: string | null = localStorage.getItem(difficulty);
    let diffStats: DifficultyStats;
    if (storage) {
      diffStats = JSON.parse(storage);
    } else if (defaults) {
      diffStats = defaults;
    } else {
      diffStats = {
        lostGames: 0,
        winGames: 0,
        bestTime: 100000000
      };
    }

    return reactive(diffStats);
  }

  const defaults: DifficultyStats = {
    lostGames: 0,
    winGames: 0,
    bestTime: 1000000
  }

  const difficultyStats = getFromLocalStorage(difficulty, defaults);

  function incrementLostGames() {
    difficultyStats.lostGames++;
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }
  function incrementWinGames() {
    difficultyStats.winGames++;
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }

  /**
   * Check if the time passed as parameter is lower than the current best time. If so, update the value.
   * @param time new possible value of time
   * @returns if the best time has been updated
   */
  function checkAndUpdateBestTime(time: number): boolean {
    if (difficultyStats.bestTime > time) {
      setBestTime(time);
      return true;
    }
    return false;
  }

  function setBestTime(time: number) {
    difficultyStats.bestTime = time;
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }

  function getStatisticsByDifficulty(difficulty: Difficulty): DifficultyStats {
    return getFromLocalStorage(difficulty, defaults);
  }

  return {
    difficultyStats,
    incrementLostGames,
    incrementWinGames,
    checkAndUpdateBestTime,
    getStatisticsByDifficulty
  };
});