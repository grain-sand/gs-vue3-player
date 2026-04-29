<template>
  <GsButton
      :icon="PlayStateIcons[(isPlaying).toString()]"
      :title="i18n.titles.play"
      @click="handleClick"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {PlayStateIcons} from '../../svgs';
import GsButton from './GsButton.vue';
import {IGsWidgetProps, II18n} from '../../type';

const props = defineProps<IGsWidgetProps>();

const isPlaying = computed(() => props.core?.playing ?? false);
const i18n = computed<II18n>(() => props.cxt?.i18n as II18n);

const handleClick = async () => {
  if (isPlaying.value) {
    await props.core?.pause();
  } else {
    await props.core?.play();
  }
};
</script>
