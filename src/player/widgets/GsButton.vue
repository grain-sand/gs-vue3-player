<template>
  <button
      class="gs-btn"
      :class="{
        'gs-text-btn': text,
        'gs-dropdown-host': hasDropdown
      }"
      :title="title"
      @click="$emit('click', $event)"
      :disabled="disabled"
  >
    <component v-if="icon" :is="icon"/>
    <span v-else-if="text">{{ text }}</span>
    <slot/>
    <slot v-if="hasDropdown" name="dropdown"/>
  </button>
</template>

<script setup lang="ts">
import {DefineComponent} from 'vue';

interface Props {
  icon?: DefineComponent | any;
  text?: string;
  title?: string;
  disabled?: boolean;
  hasDropdown?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  hasDropdown: false
});

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();
</script>
