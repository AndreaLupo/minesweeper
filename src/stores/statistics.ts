import { defineStore } from "pinia";
import { ref } from "vue";

export const useStatisticsStore = defineStore("statistics", () => {
  const lostStr = localStorage.getItem('lostGames');
  const lost: number = lostStr ? +lostStr : 0;
  const lostGames = ref(lost);



  function incrementLostGames() {
    lostGames.value++;
    localStorage.setItem('lostGames', `${lostGames.value}`);
  }

  return {
    lostGames,
    incrementLostGames
  };
});