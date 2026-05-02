<template>
  <!--  @vue-ignore  -->
  <!--suppress TypeScriptValidateTypes -->
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
import {IGsDropdownItemProps} from '../type';

withDefaults(defineProps<IGsDropdownItemProps>(), {
  active: false
});

defineEmits<{ click: (event: MouseEvent) => void }>();
</script>
