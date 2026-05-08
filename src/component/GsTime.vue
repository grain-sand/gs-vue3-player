<template>
  <div class="gs-time">
    <span>{{ formatTime(time) }}</span>
    <span v-if="duration"> / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import {formatTime} from "../util";
import {IGsTimeDisplayProps} from "../type";
defineOptions({inheritAttrs: false});
defineProps<IGsTimeDisplayProps>();
</script>
