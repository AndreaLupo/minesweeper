<template>
  <input
    class="hidden-input"
    @keydown="manageKeyboardInput"
    autofocus
    ref="keyDetector"
  />
</template>

<script setup lang="ts">
import type { InputFocusable } from "@/model/InputFocusable";
import { onMounted, ref, defineEmits } from "vue";
import { isAvailableKeyboardEvent } from "@/model/keyboard/AvailableKeyboardEvents";

// null for initial value, focus for input
const keyDetector = ref<InputFocusable>(null);

const emit = defineEmits(["keyboard-input"]);

onMounted(() => {
  setInterval(() => {
    // set focus on hidden input. 1 second is enough since the user requires some time to switch from mouse to keyboard.
    if (keyDetector.value) {
      keyDetector.value.focus();
    }
  }, 1000);
});

const manageKeyboardInput = (event: KeyboardEvent) => {
  if (isAvailableKeyboardEvent(event.code)) {
    emit("keyboard-input", event.code);
  }
};
</script>

<style scoped lang="scss"></style>
