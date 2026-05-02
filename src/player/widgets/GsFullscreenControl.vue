<template>
  <GsButton
      :icon="isDocumentFullscreen ? ExitFullscreenSvg : FullscreenSvg"
      :title="isDocumentFullscreen ? cxt.i18n.titles.exitFullscreen : cxt.i18n.titles.fullscreen"
      @click="toggleFullscreen"
  />
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from '../../component/GsButton.vue';
import {FullscreenSvg, ExitFullscreenSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isDocumentFullscreen = computed(() => !!document.fullscreenElement);

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    props.cxt.fullscreen();
  }
};
</script>
