<template>
  <GsButton
      :icon="TransformSvg"
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
          <component :is="MoveSvg"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.flipHorizontal }"
            :title="cxt.i18n.titles.flipHorizontal"
            @click.stop="cxt.toggleFlipHorizontal"
        >
          <component :is="FlipSvg"/>
        </button>
        <button
            class="gs-dropdown-item flip-vertical-icon"
            :class="{ active: cxt.transformState.flipVertical }"
            :title="cxt.i18n.titles.flipVertical"
            @click.stop="cxt.toggleFlipVertical"
        >
          <component :is="FlipSvg"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.rotation !== 0 }"
            :title="cxt.i18n.titles.rotate"
            @click.stop="cxt.rotate90"
        >
          <component :is="RotateSvg"/>
        </button>

        <div class="gs-dropdown-divider"></div>

        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transformState.scaleMode === 'fit' }"
            :title="cxt.i18n.titles.scaleFit"
            @click.stop="cxt.setScaleMode('fit')"
        >
          <component :is="FitSvg"/>
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
import {AutoSvg, TransformSvg, MoveSvg, FlipSvg, RotateSvg, FitSvg} from '../../svgs';

const props = defineProps<IGsWidgetProps>();

const handleButtonClick = () => {
  props.cxt.resetTransform();
};
</script>
