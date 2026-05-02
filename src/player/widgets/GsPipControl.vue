<template>
  <GsButton
      v-if="isPipSupported"
      :icon="isPipActive ? ExitPipSvg : PipSvg"
      :title="isPipActive ? cxt.i18n.titles.exitPip : cxt.i18n.titles.pip"
      @click="togglePip"
  />
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from './GsButton.vue';
import {PipSvg, ExitPipSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isPipSupported = ref(false);

onMounted(() => {
  isPipSupported.value = document.pictureInPictureEnabled;
});

const isPipActive = computed(() => !!document.pictureInPictureElement);

const togglePip = async () => {
  const video = props.core?.el;
  if (!video) return;

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else {
      await video.requestPictureInPicture();
    }
  } catch (error) {
    console.error('Error toggling Picture-in-Picture:', error);
  }
};
</script>
