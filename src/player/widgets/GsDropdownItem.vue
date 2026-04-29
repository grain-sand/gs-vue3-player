<template>
  <button
      class="gs-dropdown-item"
      :class="{ active: active }"
      :title="title"
      @click="handleClick"
  >
    <component v-if="icon" :is="icon"/>
    <span v-else-if="text">{{ text }}</span>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import {DefineComponent} from 'vue';

interface Props {
  icon?: DefineComponent;
  text?: string;
  title?: string;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  active: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>
