import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useStatisticsStore = defineStore("statistics", () => {

  const getFromLocalStorage = function (key: string, defaultValue?: number): Ref<number> {
    const lostStr = localStorage.getItem(key);
    const def: number = defaultValue ? defaultValue : 0;
    const lost: number = lostStr ? +lostStr : def;
    return ref(lost);
  }

  const lostGames = getFromLocalStorage('lostGames');
  const winGames = getFromLocalStorage('winGames');
  const bestTime = getFromLocalStorage('bestTime', 1000000);

  function incrementLostGames() {
    lostGames.value++;
    localStorage.setItem('lostGames', `${lostGames.value}`);
  }
  function incrementWinGames() {
    winGames.value++;
    localStorage.setItem('winGames', `${winGames.value}`);
  }

  /**
   * Check if the time passed as parameter is lower than the current best time. If so, update the value.
   * @param time new possible value of time
   * @returns 
   */
  function checkAndUpdateBestTime(time: number): boolean {
    if (bestTime.value > time) {
      setBestTime(time);
      return true;
    }
    return false;
  }

  function setBestTime(time: number) {
    console.log('New best time!');
    bestTime.value = time;
    localStorage.setItem('bestTime', `${bestTime.value}`);
  }

  return {
    lostGames,
    winGames,
    bestTime,
    incrementLostGames,
    incrementWinGames,
    checkAndUpdateBestTime
  };
});