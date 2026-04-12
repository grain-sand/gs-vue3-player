<template>
  <div v-if="controlsVisibility.fullscreen" class="gs-btn gs-dropdown-host" @click.stop="webFullscreen"
       :title="i18n.titles.webFullscreen">
    <WebFullscreenSvg style="transform: scale(0.8);"/>
    <div class="gs-dropdown" v-if="fullscreenButtonMode === 'submenu'">
      <div class="gs-dropdown-item" @click.stop="fullscreen" :title="i18n.titles.fullscreen">
        <FullscreenSvg style="transform: scale(0.8);"/>
      </div>
    </div>
  </div>
  <!-- 全屏按钮 - 控制面板模式 -->
  <div v-if="fullscreenButtonMode === 'control' && controlsVisibility.fullscreen" class="gs-btn"
       @click.stop="fullscreen" :title="i18n.titles.fullscreen">
    <FullscreenSvg style="transform: scale(0.8);"/>
  </div>
</template>

<script setup lang="ts">
import {FullscreenSvg, WebFullscreenSvg} from '../svgs';
import type {FullscreenButtonMode} from '../../types';

interface Props {
  controlsVisibility: {
    fullscreen: boolean;
  };
  fullscreenButtonMode: FullscreenButtonMode;
  i18n: {
    titles: {
      webFullscreen: string;
      fullscreen: string;
    };
  };
  webFullscreen: () => void;
  fullscreen: () => void;
}

const props = defineProps<Props>();
</script>
