<template>
  <HomeLink></HomeLink>
  <div class="container">
    <div
      class="theme"
      theme="default"
      :class="defaultSelectedClass"
      @click="switchTheme('default')"
    >
      <div class="anti-click" @click="doNothing"></div>
      <div class="text">Default</div>

      <div class="cells">
        <PlayboardCell
          v-for="cell in cellList"
          :key="cell.key"
          :cell="cell"
        ></PlayboardCell>
      </div>
    </div>
    <div
      class="theme"
      theme="dark"
      :class="darkSelectedClass"
      @click="switchTheme('dark')"
    >
      <div class="anti-click" @click="doNothing"></div>
      <div class="text">Dark</div>

      <div class="cells">
        <PlayboardCell
          v-for="cell in cellList"
          :key="cell.key"
          :cell="cell"
        ></PlayboardCell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemesStore, type Theme } from "@/stores/themes";
import { computed, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import PlayboardCell from "@/components/game/PlayboardCell.vue";
import HomeLink from "@/components/ui/HomeLink.vue";
const themeStore = useThemesStore();

themeStore.openThemePage();
const { selectedTheme, fakeGrid } = storeToRefs(themeStore);

const cellList = fakeGrid.value.cellArray;

onUnmounted(() => {
  console.log("Closed!");
  themeStore.closeThemePage();
});

const switchTheme = (theme: Theme) => {
  themeStore.updateTheme(theme);
};

const defaultSelectedClass = computed(() => {
  return { selected: selectedTheme.value === "default" };
});
const darkSelectedClass = computed(() => {
  return { selected: selectedTheme.value === "dark" };
});

function doNothing() {
  // console.log("Avoid click on cell");
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 4rem;
  position: relative;

  .anti-click {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 10;
  }

  .theme {
    padding: 3rem;
    border-radius: 15px;
    background-color: var(--color-secondary-dark);
    color: var(--text-color-bright);

    .text {
      font-size: 1.4em;
      text-align: center;
      margin-bottom: 1.4rem;
    }
    .cells {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 4px;
    }
  }
  .selected {
    border: 2px solid white;
  }
}
</style>
