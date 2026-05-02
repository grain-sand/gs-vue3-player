<template>
  <GsButton
      v-if="core?.hasPre"
      :icon="PreSvg"
      :title="cxt.i18n.titles.pre"
      @click="core.playPre()"
  />
</template>

<script setup lang="ts">
import {PreSvg} from '../../svgs';
import GsButton from '../../component/GsButton.vue';
import {IGsWidgetProps} from '../../type';

defineProps<IGsWidgetProps>();
</script>
