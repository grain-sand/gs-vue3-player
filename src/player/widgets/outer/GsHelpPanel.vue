<template>
  <teleport :to="pageRoot" :disabled="cxt.isFullscreen">
    <div
        v-if="cxt.helpVisible"
        class="gs-help-panel"
    >
      <div class="gs-help-header"
           @click.stop.prevent=""
      >
        <span>{{ cxt.i18n.titles.help }}</span>
        <GsButton
            :icon="CloseSvg"
            @click.stop.prevent="cxt.helpVisible = false"
        />
      </div>
      <div class="gs-help-content">
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.play }}</h3>
          <kbd>Space</kbd>
          <span>{{ cxt.i18n.titles.play }}</span>
        </div>
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.pre }} / {{ cxt.i18n.titles.next }}</h3>
          <kbd>↑</kbd>
          <span>{{ cxt.i18n.titles.next }}</span>
          <kbd>↓</kbd>
          <span>{{ cxt.i18n.titles.pre }}</span>
          <kbd>{{ cxt.i18n.titles.wheel }}</kbd>
          <span>{{ cxt.i18n.titles.wheelSwitch }}</span>
        </div>
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.seek }}</h3>
          <kbd>←</kbd>
          <span>{{ cxt.i18n.titles.seekBackward }}</span>
          <kbd>→</kbd>
          <span>{{ cxt.i18n.titles.seekForward }}</span>
        </div>
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.volume }}</h3>
<!--          <kbd>↑</kbd>-->
<!--          <span>{{ cxt.i18n.titles.volume }} +</span>-->
<!--          <kbd>↓</kbd>-->
<!--          <span>{{ cxt.i18n.titles.volume }} -</span>-->
          <kbd>M</kbd>
          <span>{{ cxt.i18n.titles.mute }}</span>
        </div>
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.fullscreen }}</h3>
          <kbd>F</kbd>
          <span>{{ cxt.i18n.titles.fullscreen }}</span>
          <kbd>Enter</kbd>
          <span>{{ cxt.i18n.titles.webFullscreen }}</span>
          <kbd>V</kbd>
          <span>{{ cxt.i18n.titles.pip }}</span>
        </div>
        <div class="gs-help-section">
          <h3>{{ cxt.i18n.titles.mouse }}</h3>
          <kbd>{{ cxt.i18n.titles.click }}</kbd>
          <span>{{ cxt.i18n.titles.play }}</span>
          <kbd>{{ cxt.i18n.titles.doubleClick }}</kbd>
          <span>{{ cxt.i18n.titles.webFullscreen }}</span>
          <kbd>Ctrl+{{ cxt.i18n.titles.wheel }}</kbd>
          <span>{{ cxt.i18n.titles.wheelScale }}</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {IGsWidgetProps} from '../../../type';
import {GsButton} from "../../../component";
import {CloseSvg} from "../../../svgs";

const props = defineProps<IGsWidgetProps>();

const cxt = computed(() => props.cxt);

const pageRoot = computed(() => props.props.pageRoot ?? document.body);
</script>
