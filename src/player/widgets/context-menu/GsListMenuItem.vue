<template>
  <button
      class="gs-context-menu-item"
      :class="{ 'is-active': cxt.listVisibility === 'always' }"
      @click="handleClick"
  >
    <component :is="ListSvg"/>
    <span>{{ cxt.i18n.titles.showList }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {ListSvg} from '../../../svgs';

const props = defineProps<IGsWidgetProps>();

const cxt = props.cxt;

const handleClick = () => {
  cxt.toggleListVisibility();
};
</script>
