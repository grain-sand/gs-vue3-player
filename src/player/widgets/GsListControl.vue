<template>
  <GsButton
      v-if="cxt.layout !== 'horizontal'"
      :icon="ListSvg"
      :title="isListVisible ? cxt.i18n.titles.hideList : cxt.i18n.titles.showList"
      :active="isListVisible"
      @click="cxt.toggleListVisibility()"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import {GsButton} from '../../component';
import {ListSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isListVisible = computed(() => props.cxt.listVisibility === 'always');
</script>
