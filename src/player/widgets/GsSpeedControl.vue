<template>
  <GsButton
      :text="(core?.rate ?? 1).toFixed(1)"
      :title="cxt.i18n.titles.speed"
      :has-dropdown="true"
      class="gs-text-btn"
      @mouseenter="bindWheel"
      @mouseleave="unbindWheel"
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            v-for="rate in props.props.rates"
            :key="rate"
            class="gs-dropdown-item"
            :class="{ active: rate === (core?.rate ?? 1) }"
            @click="core!.rate = rate"
        >
          {{ rate.toFixed(1) }}
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import GsButton from './GsButton.vue';

const props = defineProps<IGsWidgetProps>();

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  const rates = props.props.rates || [0.8, 1, 1.2, 1.5, 2.0, 3.0];
  const currentRate = props.core?.rate ?? 1;
  const currentIndex = rates.indexOf(currentRate);
  let newIndex = currentIndex + (e.deltaY > 0 ? -1 : 1);
  newIndex = clamp(newIndex, 0, rates.length - 1);
  props.core!.rate = rates[newIndex];
};

const bindWheel = () => document.addEventListener('wheel', handleWheel, {passive: false});
const unbindWheel = () => document.removeEventListener('wheel', handleWheel);
</script>
