<template>
  <GsButton
      v-if="core?.index > 0"
      :icon="PreSvg"
      :title="cxt.i18n.titles.pre"
      @click="core?.playPre()"
  />
</template>

<script setup lang="ts">
import {PreSvg} from '../../svgs';
import GsButton from './GsButton.vue';
import {IGsWidgetProps} from '../../type';

const props = defineProps<IGsWidgetProps>();

</script>
