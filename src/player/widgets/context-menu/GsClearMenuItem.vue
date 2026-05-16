<template>
  <button
      class="gs-context-menu-item"
      @click="core.clearPlaylist()"
  >
    <component :is="TrashSvg"/>
    <span>{{ cxt.i18n.titles.clearPlaylist }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {TrashSvg} from '../../../svgs';

defineProps<IGsWidgetProps>();
</script>
