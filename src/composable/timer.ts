import { reactive } from "vue";

export default function useTimer() {

  const gameDuration = reactive({
    seconds: 0,
    paused: false
  });

  const createTimer = (): number => {
    return setInterval(() => {
      if (!gameDuration.paused) {
        gameDuration.seconds++;
      }
    }, 1000);
  }

  let timer = createTimer();

  function togglePauseTimer(): boolean {
    gameDuration.paused = !gameDuration.paused;
    return gameDuration.paused;
  }

  function resetTime(): void {
    gameDuration.seconds = 0;
    gameDuration.paused = true;
    clearInterval(timer);
    timer = createTimer();
  }

  return {
    gameDuration,
    createTimer,
    togglePauseTimer,
    resetTime
  };
}
