<template>
  <GsButton
      :icon="TransformSvg"
      :title="cxt.i18n.titles.transform"
      :has-dropdown="true"
      :class="{ 'clean': cxt.transformChanged }"
      :active="cxt.transformChanged"
      @click="cxt.resetTransform()"
  >
    <template #dropdown>
      <div class="gs-dropdown">
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.flipHorizontal }"
            :title="cxt.i18n.titles.flipHorizontal"
            @click.stop="cxt.transform.flipHorizontal = !cxt.transform.flipHorizontal"
        >
          <component :is="FlipSvg"/>
        </button>
        <button
            class="gs-dropdown-item flip-vertical-icon"
            :class="{ active: cxt.transform.flipVertical }"
            :title="cxt.i18n.titles.flipVertical"
            @click.stop="cxt.transform.flipVertical = !cxt.transform.flipVertical"
        >
          <component :is="FlipSvg"/>
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.rotation !== 0 }"
            :title="cxt.i18n.titles.rotate"
            @click.stop="cxt.transform.rotation = (cxt.transform.rotation + 90) % 360"
        >
          <component :is="RotateSvg"/>
        </button>

        <div class="gs-dropdown-divider"></div>

        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.scaleMode === 'fit' }"
            :title="cxt.i18n.titles.scaleFit"
            @click.stop="cxt.transform.scaleMode = 'fit'"
        >
          <component :is="FitSvg"/>
        </button>

        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.scaleMode === 2 }"
            :title="cxt.i18n.titles.scale2x"
            @click.stop="cxt.transform.scaleMode = 2"
        >
          2x
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.scaleMode === 1.5 }"
            :title="cxt.i18n.titles.scale15x"
            @click.stop="cxt.transform.scaleMode = 1.5"
        >
          1.5x
        </button>
        <button
            class="gs-dropdown-item"
            :class="{ active: cxt.transform.scaleMode === 'auto' }"
            :title="cxt.i18n.titles.scaleAuto"
            @click.stop="cxt.transform.scaleMode = 'auto'"
        >
          <component :is="AutoSvg"/>
        </button>
      </div>
    </template>
  </GsButton>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {GsButton} from '../../../component';
import {AutoSvg, FitSvg, FlipSvg, RotateSvg, TransformSvg} from '../../../svgs';

defineProps<IGsWidgetProps>();
</script>
