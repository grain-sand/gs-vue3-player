<template>
  <GsButton
      :text="(core?.rate ?? 1).toFixed(1)"
      :title="cxt.i18n.titles.speed"
      :has-dropdown="true"
      class="gs-text-btn"
      @mouseenter="bindWheel"
      @mouseleave="unbindWheel"
      @wheel.stop
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            v-for="rate in rates"
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
import {computed} from "vue";

const props = defineProps<IGsWidgetProps>();
const rates = computed(() => [...props.props.rates].sort((a, b) => b - a));

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();
  e.preventDefault();
  const {value: rs} = rates;
  const currentRate = props.core?.rate ?? 1;
  const currentIndex = rs.indexOf(currentRate);
  const newIndex = clamp((currentIndex + (e.deltaY > 0 ? 1 : -1)), 0, rs.length - 1);
  if (rs[newIndex] && props.core) {
    props.core!.rate = rs[newIndex];
  }
};

const option = {
  passive: false,
  capture: true,
};
const bindWheel = () => document.addEventListener('wheel', handleWheel, option);
const unbindWheel = () => document.removeEventListener('wheel', handleWheel, option);
</script>
