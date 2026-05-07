<template>
  <button
      class="gs-context-menu-item"
      :class="{ 'is-active': cxt.listVisibility === 'always' }"
      @click="cxt.toggleListVisibility()"
  >
    <component :is="ListSvg"/>
    <span>{{ cxt.i18n.titles.showList }}</span>
  </button>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {ListSvg} from '../../../svgs';

defineProps<IGsWidgetProps>();
</script>
