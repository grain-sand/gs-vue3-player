<template>
  <div v-if="controlsVisibility.speed" class="gs-btn gs-dropdown-host" :title="i18n.titles.speed">
    <span class="gs-text-btn">{{ playbackRate.toFixed(1) }}</span>
    <div class="gs-dropdown">
      <div
          v-for="rate in playbackRates"
          :key="rate"
          class="gs-dropdown-item"
          :class="{ active: rate === playbackRate }"
          @click.stop="setPlaybackRate(rate)"
      >
        {{ rate.toFixed(1) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  controlsVisibility: {
    speed: boolean;
  };
  playbackRate: number;
  playbackRates: number[];
  i18n: {
    titles: {
      speed: string;
    };
  };
  setPlaybackRate: (rate: number) => void;
}

const props = defineProps<Props>();
</script>
