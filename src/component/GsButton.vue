<template>
  <div class="gs-btn-wrapper" :class="{ 'gs-dropdown-host': hasDropdown }">
    <!--  @vue-ignore  -->
    <!--suppress TypeScriptValidateTypes -->
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
import {IGsButtonProps} from '../type';

withDefaults(defineProps<IGsButtonProps>(), {
  disabled: false,
  hasDropdown: false,
  active: false
});

defineEmits<{ click: (event: MouseEvent) => void }>();
</script>
