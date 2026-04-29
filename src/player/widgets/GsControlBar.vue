<template>
  <div class="gs-player-footer">
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

const props = defineProps<IGsWidgetProps>();

const defaultComponents: Record<ControlItemName, IGsWidget | null> = {
  play: GsPlayButton,
  pre: GsPreButton,
  next: GsNextButton,
  time: GsTimeDisplay,
  '-': null,
  speed: null,
  volume: null,
  list: null,
  'fullscreen-menu': null,
  pip: null,
  fullscreen: null,
  webFullscreen: null
};

const progressBarComponent = computed(() => {
  const controlBarOption = props.props.controlBar;

  if (!controlBarOption || typeof controlBarOption === 'boolean') {
    return GsProgressBar;
  }

  if ('progressBar' in controlBarOption) {
    const pb = controlBarOption.progressBar;
    if (pb === false) {
      return null;
    } else if (pb === true || pb === undefined) {
      return GsProgressBar;
    } else {
      return pb;
    }
  }

  return GsProgressBar;
});

const resolvedItems = computed(() => {
  const controlBarOption = props.props.controlBar;
  let items: (ControlItemName | IGsWidget)[];

  if (controlBarOption && typeof controlBarOption !== 'boolean' && 'items' in controlBarOption) {
    items = controlBarOption.items || [...ControlDefaultItems];
  } else {
    items = [...ControlDefaultItems];
  }

  if (controlBarOption && typeof controlBarOption !== 'boolean' && controlBarOption.removeItems) {
    return items.filter(item =>
      typeof item === 'string' && !controlBarOption.removeItems!.includes(item)
    );
  }

  return items;
});

const getComponent = (item: ControlItemName | IGsWidget) => {
  if (typeof item === 'string') {
    return defaultComponents[item];
  }
  return item;
};
</script>
