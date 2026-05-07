<template>
  <GsButton
      :icon="PlaybackModeIcons[core?.mode ?? 'sequence']"
      :title="cxt.i18n.playbackModes[core?.mode ?? 'sequence']"
      :has-dropdown="true"
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            v-for="mode in availableModes"
            :key="mode.value"
            class="gs-dropdown-item"
            :class="{ active: mode.value === (core?.mode ?? 'sequence') }"
            :title="mode.text"
            @click="core!.mode = mode.value"
        >
          <component :is="PlaybackModeIcons[mode.value]"/>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../../type';
import {GsButton} from '../../../component';
import {PlaybackModeIcons} from '../../../svgs';
import type {PlaybackMode} from '../../../type';

const props = defineProps<IGsWidgetProps>();

const availableModes = computed<Array<{
  value: PlaybackMode;
  text: string
}>>(() => {
  const modes: Array<{ value: PlaybackMode; text: string }> = [
    {value: 'sequence', text: props.cxt.i18n.playbackModes.sequence},
    {value: 'disabled', text: props.cxt.i18n.playbackModes.disabled},
    {value: 'loop', text: props.cxt.i18n.playbackModes.loop}
  ];

  if (props.core?.playlist && props.core.playlist.length > 0) {
    modes.push(
        {value: 'loopAll', text: props.cxt.i18n.playbackModes.loopAll},
        {value: 'shuffle', text: props.cxt.i18n.playbackModes.shuffle},
        {value: 'deleteAfterPlay', text: props.cxt.i18n.playbackModes.deleteAfterPlay}
    );
  }

  return modes;
});
</script>
