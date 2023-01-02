import { CellStatus } from './../model/Cell';
import { FixedGrid } from '@/model/grid/FixedGrid';
import { Difficulty } from '@/model/grid/GameGrid';
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { setTheme, closeThemePage, openThemePage } from '@/composable/theme';

export type Theme = 'default' | 'dark';

export const useThemesStore = defineStore("themes", () => {
  const selectedTheme = ref(localStorage.getItem('theme') as Theme || 'default');

  // reactivity not useful here..
  const fakeGrid = reactive(new FixedGrid(Difficulty.SAMPLE));

  // open cells 
  fakeGrid.getCell(0, 0).status = CellStatus.OPEN;
  fakeGrid.getCell(0, 1).status = CellStatus.OPEN;
  fakeGrid.getCell(1, 0).status = CellStatus.OPEN;
  fakeGrid.getCell(1, 1).status = CellStatus.OPEN;
  fakeGrid.getCell(1, 2).status = CellStatus.OPEN;
  fakeGrid.getCell(2, 1).status = CellStatus.OPEN;
  fakeGrid.getCell(2, 2).status = CellStatus.FLAGGED;
  fakeGrid.getCell(2, 3).status = CellStatus.QUESTION_MARK;
  fakeGrid.getCell(4, 2).status = CellStatus.OPEN;
  fakeGrid.getCell(4, 2).numberShown = -1;
  fakeGrid.getCell(0, 3).status = CellStatus.OPEN;
  fakeGrid.getCell(0, 3).numberShown = -1;


  function updateTheme(theme: Theme) {
    setTheme(theme);
    selectedTheme.value = theme;
  }

  return {
    selectedTheme,
    fakeGrid,
    updateTheme,
    openThemePage,
    closeThemePage
  }
});