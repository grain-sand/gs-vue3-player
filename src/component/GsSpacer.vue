<template>
  <div
      class="gs-spacer"
      :style="props"
  ></div>
</template>

<script setup lang="ts">
import {IGsSpacerProps} from '../type';

const props = defineProps<IGsSpacerProps>();

</script>
