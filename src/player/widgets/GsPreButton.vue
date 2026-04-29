<template>
  <GsButton
      v-if="visible"
      :icon="PreSvg"
      :title="i18n.titles.pre"
      @click="handleClick"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {PreSvg} from '../../svgs';
import GsButton from './GsButton.vue';
import {IGsWidgetProps, II18n} from '../../type';

const props = defineProps<IGsWidgetProps>();

const i18n = computed<II18n>(() => props.cxt?.i18n as II18n);
const visible = computed(() => {
  const preSrc = props.props.preSrc;
  const playlist = props.props.playlist;
  return !!preSrc || (playlist && playlist.length > 1);
});

const handleClick = async () => {
  await props.core?.playPre();
};
</script>
