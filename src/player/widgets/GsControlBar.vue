<template>
  <div class="gs-player-footer"
       @mouseenter="$emit('mouseenter', $event)"
       @mouseleave="$emit('mouseleave', $event)"
  >
    <component
        v-if="progressBarComponent"
        :is="progressBarComponent"
        :core="props.core"
        :cxt="props.cxt"
        :props="props.props"
    />
    <div class="gs-controls" @click.stop.prevent>
      <template v-for="(item, index) in resolvedItems" :key="index">
        <div v-if="item === '-'" class="space"></div>
        <component
            v-else-if="getComponent(item)"
            :is="getComponent(item)"
            :core="props.core"
            :cxt="props.cxt"
            :props="props.props"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps, IGsWidget} from '../../type';
import {ControlItemName, ControlDefaultItems} from '../../type';
import GsPlayButton from './GsPlayButton.vue';
import GsPreButton from './GsPreButton.vue';
import GsNextButton from './GsNextButton.vue';
import GsTimeDisplay from './GsTimeDisplay.vue';
import GsProgressBar from './GsProgressBar.vue';
import GsSpeedControl from './GsSpeedControl.vue';
import GsVolumeControl from './GsVolumeControl.vue';
import GsModeControl from './GsModeControl.vue';
import GsListControl from './GsListControl.vue';
import GsFullscreenMenu from './GsFullscreenMenu.vue';
import GsPipControl from './GsPipControl.vue';
import GsFullscreenControl from './GsFullscreenControl.vue';
import GsWebFullscreenControl from './GsWebFullscreenControl.vue';

const props = defineProps<IGsWidgetProps>();
defineEmits<{
  (e: 'mouseenter', event: MouseEvent): void;
  (e: 'mouseleave', event: MouseEvent): void;
}>();

const defaultComponents: Record<ControlItemName, IGsWidget | null> = {
  play: GsPlayButton,
  pre: GsPreButton,
  next: GsNextButton,
  time: GsTimeDisplay,
  '-': null,
  speed: GsSpeedControl,
  volume: GsVolumeControl,
  mode: GsModeControl,
  list: GsListControl,
  'fullscreen-menu': GsFullscreenMenu,
  pip: GsPipControl,
  fullscreen: GsFullscreenControl,
  webFullscreen: GsWebFullscreenControl
};

const progressBarComponent = computed(() => {
  const pb = props.props.controlBar?.progressBar;
  if (pb === false) return null;
  if (pb && typeof pb !== 'boolean') return pb;
  return GsProgressBar;
});

const resolvedItems = computed(() => {
  const items = Array.isArray(props.props.controlBar?.items)
      ? props.props.controlBar.items
      : [...ControlDefaultItems];
  return props.props.controlBar?.removeItems
      ? items.filter(item => typeof item === 'string' && !props.props.controlBar!.removeItems!.includes(item))
      : items;
});

const getComponent = (item: ControlItemName | IGsWidget) => {
  return typeof item === 'string' ? defaultComponents[item] : item;
};
</script>
