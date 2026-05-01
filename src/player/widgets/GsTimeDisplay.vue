<template>
  <div class="gs-time-display">
    <span>{{ formatTime(core?.time ?? 0) }}</span>
    <span v-if="core?.duration"> / {{ formatTime(core.duration) }}</span>
  </div>
</template>

<script setup lang="ts">
import {formatTime} from "../../util";
import {IGsWidgetProps} from "../../type";

defineProps<IGsWidgetProps>();
</script>
