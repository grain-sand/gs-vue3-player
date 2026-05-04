<template>
  <GsButton
      :title="currentAspectRatioText"
      :has-dropdown="true"
  >
    <component v-if="props.cxt.aspectRatio === 'auto'" :is="AutoSvg"/>
    <span v-else>{{ displayRatio }}</span>
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            v-for="option in aspectRatioOptions"
            :key="option.text"
            class="gs-dropdown-item"
            :class="{ active: isActive(option.value) }"
            :title="option.text"
            @click="setAspectRatio(option.value)"
        >
          <component v-if="option.value === 'auto'" :is="AutoSvg"/>
          <span v-else>{{ option.text }}</span>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps, AspectRatioMode, DefaultAspectRatios} from '../../type';
import {GsButton} from '../../component';
import {AutoSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const aspectRatioOptions = computed(() => {
  const options: Array<{ value: AspectRatioMode; text: string }> = [
    {value: 'auto', text: props.cxt.i18n.titles.aspectRatioAuto}
  ];

  DefaultAspectRatios.forEach((ratio) => {
    options.push({
      value: ratio,
      text: `${ratio[0]}:${ratio[1]}`
    });
  });

  return options;
});

const currentAspectRatioText = computed(() => {
  const aspectRatio = props.cxt.aspectRatio;
  if (aspectRatio === 'auto') {
    return props.cxt.i18n.titles.aspectRatioAuto;
  }
  return `${aspectRatio[0]}:${aspectRatio[1]}`;
});

const displayRatio = computed(() => {
  const aspectRatio = props.cxt.aspectRatio;
  return `${aspectRatio[0]}:${aspectRatio[1]}`;
});

function isActive(value: AspectRatioMode): boolean {
  const current = props.cxt.aspectRatio;
  if (value === 'auto') {
    return current === 'auto';
  }
  return Array.isArray(current) &&
      current[0] === (value as [number, number])[0] &&
      current[1] === (value as [number, number])[1];
}

function setAspectRatio(value: AspectRatioMode) {
  props.cxt.aspectRatio = value;
}
</script>
