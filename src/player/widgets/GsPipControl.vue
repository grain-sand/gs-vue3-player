<template>
  <GsButton
      v-if="props.core?.supportsPip"
      :icon="props.core.pipState ? ExitPipSvg : PipSvg"
      :title="props.core.pipState ? cxt.i18n.titles.exitPip : cxt.i18n.titles.pip"
      @click="props.core.togglePip"
  />
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {GsButton} from '../../component';
import {PipSvg, ExitPipSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();
</script>
