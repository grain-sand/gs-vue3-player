<template>
  <div class="gs-btn-wrapper" :class="{ 'gs-dropdown-host': hasDropdown }">
    <!--  @vue-ignore  -->
    <!--suppress TypeScriptValidateTypes -->
    <button
        class="gs-btn"
        :class="[
          { 'gs-text-btn': text, active: active },
          $props.class
        ]"
        :title="title"
        :disabled="disabled"
        @click="$emit('click', $event)"
        @mouseenter="$emit('mouseenter', $event)"
        @mouseleave="$emit('mouseleave', $event)"
    >
      <component v-if="icon" :is="icon"/>
      <span v-else-if="text">{{ text }}</span>
      <slot/>
    </button>
    <slot v-if="hasDropdown" name="dropdown"/>
  </div>
</template>

<script setup lang="ts">
import {IGsButtonEmits, IGsButtonProps} from '../type';

defineOptions({inheritAttrs: false});

withDefaults(defineProps<IGsButtonProps>(), {
  disabled: false,
  hasDropdown: false,
  active: false
});

defineEmits<IGsButtonEmits>();
</script>
