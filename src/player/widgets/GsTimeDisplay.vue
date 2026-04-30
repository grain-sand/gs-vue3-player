<template>
  <div class="gs-time-display">
    <span>{{ formatTime(currentTime) }}</span>
    <span v-if="showDuration"> / {{ formatTime(duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {formatTime} from "../../util";
import {IGsWidgetProps} from "../../type";

const props = defineProps<IGsWidgetProps>();

const currentTime = computed(() => props.core?.time ?? 0);
const duration = computed(() => props.core?.duration ?? 0);
const showDuration = computed(() => duration.value > 0);
</script>
