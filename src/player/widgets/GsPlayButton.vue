<template>
  <GsButton
      :icon="PlayStateIcons[core?.playing?.toString() || 'false']"
      :title="cxt.i18n.titles.play"
      @click="core?.playing ? core.pause() : core.play()"
  />
</template>

<script setup lang="ts">
import {PlayStateIcons} from '../../svgs';
import {GsButton} from '../../component';
import {IGsWidgetProps} from '../../type';

defineProps<IGsWidgetProps>();
</script>
