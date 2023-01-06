import { LocalStorageManager } from './../composable/statisticsManagers/LocalStorageManager';
import { Difficulty, GameResult } from "@/model/grid/GameGrid";
import { defineStore } from "pinia";
import { reactive } from "vue";
import type { StatisticsManager } from '@/model/statistics/StatisticsManager';

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

  const statisticsManager: StatisticsManager = new LocalStorageManager();

  type DifficultyStatsReference = Record<Difficulty, DifficultyStats>;
  const difficultyStats: DifficultyStatsReference = reactive({
    [Difficulty.EASY]: statisticsManager.getStatisticsByDifficulty(Difficulty.EASY),
    [Difficulty.MEDIUM]: statisticsManager.getStatisticsByDifficulty(Difficulty.MEDIUM),
    [Difficulty.DIFFICULT]: statisticsManager.getStatisticsByDifficulty(Difficulty.DIFFICULT),
    [Difficulty.TUTORIAL]: statisticsManager.getStatisticsByDifficulty(Difficulty.TUTORIAL),
    [Difficulty.SAMPLE]: statisticsManager.getStatisticsByDifficulty(Difficulty.SAMPLE),
  });

  function incrementLostGames(difficulty: Difficulty) {
    difficultyStats[difficulty].lostGames++;
  }
  function incrementWinGames(difficulty: Difficulty) {
    difficultyStats[difficulty].winGames++;
  }

  function updateTotalTime(difficulty: Difficulty, seconds: number) {
    difficultyStats[difficulty].totalTime = difficultyStats[difficulty].totalTime + seconds;
  }

  /**
   * Check if the time passed as parameter is lower than the current best time. If so, update the value.
   * @param time new possible value of time
   * @returns if the best time has been updated
   */
  function checkAndUpdateBestTime(difficulty: Difficulty, time: number): boolean {
    if (difficultyStats[difficulty].bestTime.time > time) {
      setBestTime(difficulty, time);
      return true;
    }
    return false;
  }

  function setBestTime(difficulty: Difficulty, time: number) {
    difficultyStats[difficulty].bestTime.time = time;
    difficultyStats[difficulty].bestTime.when = Date.now();
  }

  function getCurrentGameDifficulty(): Difficulty {
    return localStorage.getItem('currentGameDifficulty') as Difficulty;
  }

  function getStatisticsByDifficulty(difficulty: Difficulty): DifficultyStats {
    return reactive(statisticsManager.getStatisticsByDifficulty(difficulty));
  }

  function updateSeries(difficulty: Difficulty, result: GameResult) {
    const lastGameResult = getLastGameResult(difficulty);

    if (lastGameResult !== result) {
      // reset serie if result change (ex. lost -> win)
      difficultyStats[difficulty].series.current = 0;
    }

    // increase the current serie
    if (result === GameResult.WIN) {
      difficultyStats[difficulty].series.current++;
    } else {
      difficultyStats[difficulty].series.current--;
    }

    checkAndUpdateBestSeries(difficulty, result);

  }

  function getLastGameResult(difficulty: Difficulty): GameResult {
    if (difficultyStats[difficulty].series.current > 0) {
      return GameResult.WIN;
    } else {
      return GameResult.LOST;
    }
  }

  function checkAndUpdateBestSeries(difficulty: Difficulty, result: GameResult): boolean {
    if (result === GameResult.WIN) {
      if (difficultyStats[difficulty].series.current > difficultyStats[difficulty].series.longestWin) {
        difficultyStats[difficulty].series.longestWin = difficultyStats[difficulty].series.current;
        return true;
      }
    } else {
      const currentLostSerie = Math.abs(difficultyStats[difficulty].series.current);
      if (currentLostSerie > difficultyStats[difficulty].series.longestLost) {
        difficultyStats[difficulty].series.longestLost = currentLostSerie;
        return true;
      }
    }
    return false;
  }

  /**
   * 
   * @param result 
   * @param seconds 
   * @returns if there was an update of best time
   */
  function updateStatistics(difficulty: Difficulty, result: GameResult, seconds: number): boolean {
    let bestTimeUpdated = false;
    if (result === GameResult.LOST) {
      incrementLostGames(getCurrentGameDifficulty());
      bestTimeUpdated = false;
    } else {
      incrementWinGames(getCurrentGameDifficulty());
      bestTimeUpdated = checkAndUpdateBestTime(difficulty, seconds);
    }

    updateTotalTime(getCurrentGameDifficulty(), seconds);
    updateSeries(difficulty, result);

    statisticsManager.updateStatisticsByDifficulty(difficulty, difficultyStats[difficulty]);

    return bestTimeUpdated;
  }

  return {
    difficultyStats,
    checkAndUpdateBestTime,
    getStatisticsByDifficulty,
    updateStatistics
  };
});