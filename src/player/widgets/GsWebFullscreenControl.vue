<template>
  <GsButton
      :icon="isFullscreen ? ExitFullscreenSvg : WebFullscreenSvg"
      :title="isFullscreen ? cxt.i18n.titles.exitFullscreen : cxt.i18n.titles.webFullscreen"
      @click="toggleWebFullscreen"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from '../../component/GsButton.vue';
import {WebFullscreenSvg, ExitFullscreenSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isFullscreen = computed(() => props.cxt.isFullscreen);

const toggleWebFullscreen = () => {
  if (props.cxt.isFullscreen) {
    props.cxt.exitFullscreen();
  } else {
    props.cxt.webFullscreen();
  }
};
</script>
