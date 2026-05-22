<template>
  <button
      class="gs-list-tab"
      :class="{ active: active }"
      @click="setActive"
  >
    {{ tab.title }}
  </button>
</template>

<script setup lang="ts">
import {IListTabHeaderPartProps} from '../../../type';

defineProps<IListTabHeaderPartProps>();

defineOptions({inheritAttrs: false});
</script>
