<template>
  <GsButton
      :icon="currentIcon"
      :title="currentTitle"
      :has-dropdown="!isFullscreen && !isPipActive"
      @click="handleClick"
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            class="gs-dropdown-item"
            @click="toggleFullscreen"
            :title="isDocumentFullscreen ? cxt.i18n.titles.exitFullscreen : cxt.i18n.titles.fullscreen"
        >
          <component :is="isDocumentFullscreen ? ExitFullscreenSvg : FullscreenSvg"/>
        </button>
        <button
            v-if="isPipSupported"
            class="gs-dropdown-item"
            @click="togglePip"
            :title="isPipActive ? cxt.i18n.titles.exitPip : cxt.i18n.titles.pip"
        >
          <component :is="isPipActive ? ExitPipSvg : PipSvg"/>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from './GsButton.vue';
import {FullscreenSvg, ExitFullscreenSvg, PipSvg, ExitPipSvg, WebFullscreenSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isPipSupported = ref(false);

onMounted(() => {
  isPipSupported.value = document.pictureInPictureEnabled;
});

const isFullscreen = computed(() => props.cxt.isFullscreen);
const isDocumentFullscreen = computed(() => !!document.fullscreenElement);
const isPipActive = computed(() => !!document.pictureInPictureElement);

const currentIcon = computed(() => {
  if (isPipActive.value) return ExitPipSvg;
  if (isFullscreen.value) return ExitFullscreenSvg;
  return WebFullscreenSvg;
});

const currentTitle = computed(() => {
  if (isPipActive.value) return props.cxt.i18n.titles.exitPip;
  if (isFullscreen.value) return props.cxt.i18n.titles.exitFullscreen;
  return props.cxt.i18n.titles.webFullscreen;
});

const handleClick = () => {
  if (isPipActive.value) {
    document.exitPictureInPicture?.();
  } else if (isFullscreen.value) {
    props.cxt.exitFullscreen();
  } else {
    props.cxt.webFullscreen();
  }
};

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  } else {
    props.cxt.fullscreen();
  }
};

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
