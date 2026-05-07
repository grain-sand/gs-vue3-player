<template>
  <button
      class="gs-context-menu-item"
      :class="{ 'is-active': cxt.helpPanelVisible }"
      @click="cxt.helpPanelVisible = !cxt.helpPanelVisible"
  >
    <component :is="HelpSvg"/>
    <span>{{ cxt.i18n.titles.help }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {HelpSvg} from '../../../svgs';

defineProps<IGsWidgetProps>();
</script>
