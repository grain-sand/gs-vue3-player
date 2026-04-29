<template>
  <GsButton
      v-if="visible"
      :icon="NextSvg"
      :title="i18n.titles.next"
      @click="handleClick"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {NextSvg} from '../../svgs';
import GsButton from './GsButton.vue';
import {IGsWidgetProps, II18n} from '../../type';

const props = defineProps<IGsWidgetProps>();

const i18n = computed<II18n>(() => props.cxt?.i18n as II18n);
const visible = computed(() => {
  const nextSrc = props.props.nextSrc;
  const playlist = props.props.playlist;
  return !!nextSrc || (playlist && playlist.length > 1);
});

const handleClick = async () => {
  await props.core?.playNext();
};
</script>
