<template>
  <GsButton
      v-if="core?.hasNext"
      :icon="NextSvg"
      :title="cxt.i18n.titles.next"
      @click="core.playNext()"
  />
</template>

<script setup lang="ts">
import {NextSvg} from '../../svgs';
import {GsButton} from '../../component';
import {IGsWidgetProps} from '../../type';

defineProps<IGsWidgetProps>();
</script>
