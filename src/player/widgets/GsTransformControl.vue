<template>
  <GsButton
      :icon="TransformIcon"
      :title="cxt.i18n.titles.transform"
      :has-dropdown="true"
      @click="handleButtonClick"
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.draggable }"
            :title="cxt.i18n.titles.draggable"
            @click.stop="cxt.toggleDraggable"
        >
          <component :is="DragIcon"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.flipHorizontal }"
            :title="cxt.i18n.titles.flipHorizontal"
            @click.stop="cxt.toggleFlipHorizontal"
        >
          <component :is="FlipHorizontalIcon"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.flipVertical }"
            :title="cxt.i18n.titles.flipVertical"
            @click.stop="cxt.toggleFlipVertical"
        >
          <component :is="FlipVerticalIcon"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.rotation !== 0 }"
            :title="cxt.i18n.titles.rotate"
            @click.stop="cxt.rotate90"
        >
          <component :is="RotateIcon"/>
        </button>

        <div class="gs-dropdown-divider"></div>

        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.scaleMode === 'fit' }"
            :title="cxt.i18n.titles.scaleFit"
            @click.stop="cxt.setScaleMode('fit')"
        >
          <component :is="FitIcon"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.scaleMode === '2x' }"
            :title="cxt.i18n.titles.scale2x"
            @click.stop="cxt.setScaleMode('2x')"
        >
          2x
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.scaleMode === '1.5x' }"
            :title="cxt.i18n.titles.scale15x"
            @click.stop="cxt.setScaleMode('1.5x')"
        >
          1.5x
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.scaleMode === 'auto' }"
            :title="cxt.i18n.titles.scaleAuto"
            @click.stop="cxt.setScaleMode('auto')"
        >
          <component :is="AutoSvg"/>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {GsButton} from '../../component';
import {AutoSvg} from '../../svgs';
import {h, type Component} from 'vue';

const props = defineProps<IGsWidgetProps>();

const TransformIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('polyline', {points: '12 15 15 12 9 12'}),
      h('polyline', {points: '18 15 21 12 15 12'}),
      h('polyline', {points: '6 15 3 12 9 12'}),
      h('circle', {cx: '12', cy: '12', r: '3'})
    ]);
  }
};

const DragIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', {x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2'}),
      h('line', {x1: '9', y1: '3', x2: '9', y2: '21'}),
      h('line', {x1: '15', y1: '3', x2: '15', y2: '21'}),
      h('line', {x1: '21', y1: '9', x2: '3', y2: '9'}),
      h('line', {x1: '21', y1: '15', x2: '3', y2: '15'})
    ]);
  }
};

const FlipHorizontalIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', {d: 'M3 7h18'}),
      h('path', {d: 'M21 12H3'}),
      h('path', {d: 'M12 17a9 9 0 0 1-9-9 9.75 9.75 0 0 1 6.75-9.35L12 3'})
    ]);
  }
};

const FlipVerticalIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', {d: 'M12 21V3'}),
      h('path', {d: 'M5 12h14'}),
      h('path', {d: 'M17 5a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.75-9.35L3 12'})
    ]);
  }
};

const RotateIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', {d: 'M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.75 2.75L3 8'}),
      h('path', {d: 'M3 3v5h5'}),
      h('path', {d: 'M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.75-2.75L21 16'}),
      h('path', {d: 'M16 21h5v-5'})
    ]);
  }
};

const FitIcon: Component = {
  render() {
    return h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', {x: '3', y: '3', width: '18', height: '18', rx: '2', ry: '2'}),
      h('path', {d: 'M9 9h6v6H9z'})
    ]);
  }
};

const handleButtonClick = () => {
  props.cxt.resetTransform();
};
</script>
