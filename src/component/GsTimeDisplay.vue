<template>
  <div class="gs-time-display">
    <span>{{ formatTime(time) }}</span>
    <span v-if="duration"> / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import {formatTime} from "../util";
import {IGsTimeDisplayProps} from "../type";

defineProps<IGsTimeDisplayProps>();
</script>
