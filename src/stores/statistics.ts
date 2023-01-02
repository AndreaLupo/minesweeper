import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import { defineStore } from "pinia";
import { reactive } from "vue";

type BestTime = {
  time: number;
  when: number;
}

type Serie = {
  longestWin: number;
  longestLost: number;
  current: number;
  lastMatch?: GameResult
}

export interface DifficultyStats {
  lostGames: number;
  winGames: number;
  bestTime: BestTime;
  series: Serie;
  totalTime: number;
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
        bestTime: {
          time: 100000000,
          when: Date.parse('1/01/1970')
        },
        series: {
          longestWin: 0,
          longestLost: 0,
          current: 0
        },
        totalTime: 0
      };
    }

    return reactive(diffStats);
  }

  const defaults: DifficultyStats = {
    lostGames: 0,
    winGames: 0,
    bestTime: {
      time: 100000000,
      when: Date.parse('1/01/1970')
    },
    series: {
      longestWin: 0,
      longestLost: 0,
      current: 0
    },
    totalTime: 0
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

  function updateTotalTime(seconds: number) {
    difficultyStats.totalTime = difficultyStats.totalTime + seconds;
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }

  /**
   * Check if the time passed as parameter is lower than the current best time. If so, update the value.
   * @param time new possible value of time
   * @returns if the best time has been updated
   */
  function checkAndUpdateBestTime(time: number): boolean {
    if (difficultyStats.bestTime.time > time) {
      setBestTime(time);
      return true;
    }
    return false;
  }

  function setBestTime(time: number) {
    difficultyStats.bestTime.time = time;
    difficultyStats.bestTime.when = Date.now();
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }

  function getStatisticsByDifficulty(difficulty: Difficulty): DifficultyStats {
    return getFromLocalStorage(difficulty, defaults);
  }

  /**
   * 
   * @param result 
   * @param seconds 
   * @returns if there was an update of best time
   */
  function updateStatistics(result: GameResult, seconds: number): boolean {
    let bestTimeUpdated = false;
    if (result === GameResult.LOST) {
      incrementLostGames();
      bestTimeUpdated = false;
    } else {
      incrementWinGames();
      bestTimeUpdated = checkAndUpdateBestTime(seconds);
    }

    updateTotalTime(seconds);


    return bestTimeUpdated;
  }

  return {
    difficultyStats,
    checkAndUpdateBestTime,
    getStatisticsByDifficulty,
    updateStatistics
  };
});