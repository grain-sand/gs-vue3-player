<template>
  <button
      class="gs-context-menu-item"
      :class="{ 'is-active': cxt.infoPanelVisible }"
      @click="cxt.infoPanelVisible = !cxt.infoPanelVisible"
  >
    <component :is="InfoSvg"/>
    <span>{{ cxt.i18n.titles.info }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {InfoSvg} from '../../../svgs';

defineProps<IGsWidgetProps>();
</script>
