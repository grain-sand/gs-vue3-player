<template>
  <GsButton
      :icon="isMuted ? VolumeStateIcons['true'] : VolumeStateIcons['false']"
      :title="isMuted || volume === 0 ? cxt.i18n.titles.mute : cxt.i18n.titles.volume"
      :has-dropdown="true"
      @click="toggleMute"
      @mouseenter="bindWheel"
      @mouseleave="unbindWheel"
  >
    <template #dropdown>
      <div class="gs-dropdown gs-volume-panel">
        <div class="gs-volume-val">{{ Math.round(volume * 100) }}%</div>
        <div class="gs-volume-slider" @mousedown="handleVolumeSliderClick">
          <div class="gs-volume-track">
            <div class="gs-volume-fill" :style="{ height: `${volume * 100}%` }"></div>
            <div class="gs-volume-handle" :style="{ bottom: `${volume * 100}%` }"></div>
          </div>
        </div>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import GsButton from '../../component/GsButton.vue';
import {VolumeStateIcons} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const volume = computed(() => props.core?.volume ?? 0);
const isMuted = computed(() => props.core?.muted ?? false);

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const setVolume = (newVol: number) => {
  props.core!.volume = clamp(newVol, 0, 1);
};

const toggleMute = () => {
  props.core!.muted = !props.core!.muted;
};

const handleVolumeSliderClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  setVolume((rect.bottom - e.clientY) / rect.height);
};

const handleVolumeWheel = (e: WheelEvent) => {
  e.stopPropagation();
  e.preventDefault();
  setVolume(volume.value + (e.deltaY > 0 ? -0.1 : 0.1));
};

const option = {
  passive: false,
  capture: true,
};
const bindWheel = () => document.addEventListener('wheel', handleVolumeWheel, option);
const unbindWheel = () => document.removeEventListener('wheel', handleVolumeWheel, option);
</script>
