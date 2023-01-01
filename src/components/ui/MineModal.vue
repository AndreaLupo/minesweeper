<template>
  <teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <header :class="classHeader">
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
        <menu v-if="!fixed">
          <slot name="actions">
            <button @click="tryClose">Close</button>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  fixed: {
    type: Boolean,
    required: false,
    default: false,
  },
  win: {
    type: Boolean,
    required: false,
  },
});
const emit = defineEmits(["close"]);

const tryClose = () => {
  if (props.fixed) {
    return;
  }
  emit("close");
};

const classHeader = computed((): string => {
  let _class = "";

  if (props.win != undefined) {
    if (props.win) {
      _class = "green";
    } else {
      _class = "red";
    }
  }

  return _class;
});
</script>

<style scoped lang="scss">
@import "@/assets/themes.scss";

:export {
  red: red;
  green: var(--color-secondary);
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}

header {
  background-color: $color-brown;
  &.red {
    background-color: #990000;
  }
  &.green {
    background-color: var(--color-secondary);
  }

  color: white;
  width: 100%;
  padding: 1rem;
  h2 {
    margin: 0;
  }
}

section {
  padding: 1rem;
}

menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}
</style>
