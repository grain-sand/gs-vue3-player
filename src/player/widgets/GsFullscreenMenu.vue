<template>
  <GsButton
      :icon="currentIcon"
      :title="currentTitle"
      :has-dropdown="!props.cxt.isFullscreen && !props.core?.pipState"
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
            v-if="props.core?.supportsPip"
            class="gs-dropdown-item"
            @click="props.core.togglePip"
            :title="props.core.pipState ? cxt.i18n.titles.exitPip : cxt.i18n.titles.pip"
        >
          <component :is="props.core.pipState ? ExitPipSvg : PipSvg"/>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from '../../component/GsButton.vue';
import {FullscreenSvg, ExitFullscreenSvg, PipSvg, ExitPipSvg, WebFullscreenSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const isDocumentFullscreen = computed(() => !!document.fullscreenElement);

const currentIcon = computed(() => {
  if (props.core?.pipState) return ExitPipSvg;
  if (props.cxt.isFullscreen) return ExitFullscreenSvg;
  return WebFullscreenSvg;
});

const currentTitle = computed(() => {
  if (props.core?.pipState) return props.cxt.i18n.titles.exitPip;
  if (props.cxt.isFullscreen) return props.cxt.i18n.titles.exitFullscreen;
  return props.cxt.i18n.titles.webFullscreen;
});

const handleClick = () => {
  if (props.core?.pipState) {
    props.core.exitPip();
  } else if (props.cxt.isFullscreen) {
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
</script>
