<template>
  <div
      class="gs-spacer"
      :style="props"
  ></div>
</template>

<script setup lang="ts">
import {IGsSpacerProps} from '../type';


defineOptions({inheritAttrs: false});
const props = defineProps<IGsSpacerProps>();

</script>
