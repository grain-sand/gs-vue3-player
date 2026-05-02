<template>
  <div class="gs-btn-wrapper" :class="{ 'gs-dropdown-host': hasDropdown }">
    <button
        class="gs-btn"
        :class="{ 'gs-text-btn': text, active: active }"
        :title="title"
        @click="$emit('click', $event)"
        :disabled="disabled"
    >
      <component v-if="icon" :is="icon"/>
      <span v-else-if="text">{{ text }}</span>
      <slot/>
    </button>
    <slot v-if="hasDropdown" name="dropdown"/>
  </div>
</template>

<script setup lang="ts">
import {DefineComponent} from 'vue';

interface Props {
  icon?: DefineComponent | any;
  text?: string;
  title?: string;
  disabled?: boolean;
  hasDropdown?: boolean;
  active?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  hasDropdown: false,
  active: false
});

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();
</script>
