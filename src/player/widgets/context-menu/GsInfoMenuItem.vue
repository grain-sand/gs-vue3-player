<template>
  <button
      class="gs-context-menu-item"
      :class="{ 'is-active': cxt.infoPanelVisible }"
      @click="handleClick"
  >
    <component :is="InfoSvg"/>
    <span>{{ cxt.i18n.titles.info }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {InfoSvg} from '../../../svgs';

const props = defineProps<IGsWidgetProps>();

const cxt = props.cxt;

const handleClick = () => {
  cxt.infoPanelVisible = !cxt.infoPanelVisible;
};
</script>
