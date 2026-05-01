<template>
  <GsButton
      v-if="core?.playlist?.[core?.index+1]"
      :icon="NextSvg"
      :title="cxt.i18n.titles.next"
      @click="core?.playNext()"
  />
</template>

<script setup lang="ts">
import {NextSvg} from '../../svgs';
import GsButton from './GsButton.vue';
import {IGsWidgetProps} from '../../type';

defineProps<IGsWidgetProps>();
</script>
