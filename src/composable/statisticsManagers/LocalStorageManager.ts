import type { StatisticsManager } from '@/model/statistics/StatisticsManager';

export class LocalStorageManager implements StatisticsManager {
  getStatisticsByDifficulty(difficulty: Difficulty): DifficultyStats {
    console.log('Get from class');
    return this.getFromLocalStorage(difficulty);
  }
  updateStatisticsByDifficulty(difficulty: Difficulty, difficultyStats: DifficultyStats): void {
    console.log('Update from class');
    localStorage.setItem(difficulty, JSON.stringify(difficultyStats));
  }

  getFromLocalStorage(difficulty: Difficulty, defaults?: DifficultyStats): DifficultyStats {
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

    return diffStats;
  }
}