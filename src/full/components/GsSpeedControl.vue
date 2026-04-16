<template>
  <div v-if="player.controlsVisibility.speed" class="gs-btn gs-dropdown-host" :title="player.i18n.titles.speed">
    <span class="gs-text-btn">{{ (player.playerRef.value?.rate || 1).toFixed(1) }}</span>
    <div class="gs-dropdown">
      <div
          v-for="rate in player.rates"
          :key="rate"
          class="gs-dropdown-item"
          :class="{ active: rate === (player.playerRef.value?.rate || 1) }"
          @click.stop="player.setPlaybackRate(rate)"
      >
        {{ rate.toFixed(1) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { PlayerInjectKey } from '../types/PlayerInject';

import type { PlayerInject } from '../types/PlayerInject';

const player = inject<PlayerInject>(PlayerInjectKey)!;
</script>
