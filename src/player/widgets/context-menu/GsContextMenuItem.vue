<template>
  <button
      class="gs-context-menu-item"
      @click="handleClick"
  >
    <component :is="iconComponent"/>
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {II18n} from '../../../type';
import {getContextMenuItemIcon, getContextMenuItemLabel} from './contextMenuUtils';

const props = defineProps<{
  item: string;
  i18n: II18n;
}>();

const emit = defineEmits<{
  (e: 'action', item: string): void;
}>();

const iconComponent = computed(() => getContextMenuItemIcon(props.item));

const label = computed(() => getContextMenuItemLabel(props.item, props.i18n));

const handleClick = () => {
  emit('action', props.item);
};
</script>
