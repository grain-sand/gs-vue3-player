<template>
  <button
      class="gs-dropdown-item"
      :class="{ active: active }"
      :title="title"
      @click="$emit('click', $event)"
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

withDefaults(defineProps<Props>(), {
  active: false
});

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();
</script>
