<template>
  <teleport to="body">
    <div @click="goToHome">
      <font-awesome-icon icon="fa-solid fa-house" />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import router from "@/router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

library.add(faHouse);
const goToHome = () => {
  router.push("/");
};
</script>

<style scoped lang="scss">
div {
  position: absolute;
  cursor: pointer;
  top: 2rem;
  left: 2rem;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  color: var(--color-accent);
  padding: 0.25rem 0.5rem;
  font-size: 1.4em;
}
</style>
