export interface StatisticsManager {
  getStatisticsByDifficulty(difficulty: Difficulty): DifficultyStats;
  updateStatisticsByDifficulty(difficulty: Difficulty, difficultyStats: DifficultyStats): void;
}