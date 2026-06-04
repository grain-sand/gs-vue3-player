<template>
  <teleport :to="pageRoot" :disabled="!isWebFullscreen">
    <div
        :class="[
          'gs-player',
          `layout-${rtLayout}`,
          `list-visibility-${listVisibility}`,
          {
            'fullscreen': isFullscreen,
            'controls-visible': controlsVisible
          }
        ]"
        ref="rootRef"
        tabindex="0"
    >
      <div class="gs-video-wrapper"
           ref="wrapperRef"
           @mouseenter="!isFullscreen && (isHovering= true)"
           @mouseleave="isHovering= false"
      >
        <!--suppress TypeScriptValidateTypes -->
        <!-- @vue-ignore -->
        <PlayerCore
            ref="coreRef"
            :src="props.src"
            :hls-config="props.hlsConfig"
            :quality="props.quality"
            :use-browser-hls="props.useBrowserHls"
            :rate="props.rate"
            :volume="props.volume||0.5"
            :autoplay="props.autoplay"
            :controls="false"
            :muted="props.muted"
            :next-src="props.nextSrc"
            :pre-src="props.preSrc"
            :playlist="props.playlist"
            :mode="props.mode"
            @src-changed="handleSrcChange"
            @src-removed="trigger('srcRemoved', $event)"
            @src-inserted="trigger('srcInserted', $event)"
            @volume-changed="trigger('volumeChanged', $event)"
            @muted-changed="trigger('mutedChanged', $event)"
            @rate-changed="trigger('rateChanged', $event)"
            @mode-changed="trigger('modeChanged', $event)"
            @clearPlaylist="trigger('clearPlaylist', $event)"
        />

        <template v-if="coreRef">
          <component
              v-if="widgets.controlBar"
              :is="widgets.controlBar"
              v-bind="widgetProps"
              @mouseenter="isHovering= true"
              @mouseleave="isHovering= false"
          />

          <component
              v-for="widget in widgets.innerWidgets"
              :is="widget"
              v-bind="widgetProps"
          />
        </template>
      </div>

      <template v-if="coreRef">
        <component
            v-for="widget in widgets.outerWidgets"
            :is="widget"
            v-bind="widgetProps"
        />
      </template>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, shallowRef} from 'vue';
import {PlayerCore} from '../core';
import {
  AspectRatio,
  AspectRatioMode,
  DefaultAspectRatio,
  DefaultControlVisibility,
  DefaultI18nName,
  DefaultLayoutMode,
  DefaultLinkHandler,
  DefaultListContainerVisibility,
  DefaultRates,
  DefaultTransform,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsWidgetContext,
  II18n,
  IPlayerCoreExpose,
  IGsTransform,
  LayoutMode,
  VisibilityMode
} from '../type';
import {getI18nConfig} from './i18n';
import {resolveWidgets} from './widgets';
import {LogicManager} from "./logics";

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  i18n: () => DefaultI18nName,
  aspectRatio: <any>DefaultAspectRatio,
  layout: DefaultLayoutMode,
  handleClick: true,
  handleDblClick: true,
  rates: () => DefaultRates,
  controlVisibility: DefaultControlVisibility,
  pageRoot: () => document.body,
  disableWheelNavigation: false,
  listVisibility: DefaultListContainerVisibility,
  infoPanelVisible: true,
  linkHandler: DefaultLinkHandler,
  defaultTransform: <any>DefaultTransform,
  keyboardTarget: '.gs-player,.gs-player *',
});

const emit = defineEmits<IGsPlayerEmits>();

const defaultTransform = Object.freeze({...DefaultTransform, ...props.defaultTransform});

function trigger<T extends keyof IGsPlayerEmits>(e: T, arg: Parameters<IGsPlayerEmits[T]>[0]) {
  // @ts-ignore
  emit(e, arg);
}

function handleSrcChange(src: any) {
  trigger('srcChanged', src);
}

const rootRef = ref<HTMLDivElement>();
const wrapperRef = ref<HTMLDivElement>();
const coreRef = ref<IPlayerCoreExpose>();
const isWebFullscreen = ref(false);
const currLayout = ref<LayoutMode>(props.layout);
const currentAspectRatio = ref<AspectRatioMode>(props.aspectRatio || DefaultAspectRatio);
const isHovering = ref(false);
const controlVisibility = ref<VisibilityMode>(props.controlVisibility);
const listVisibility = ref<VisibilityMode>(props.listVisibility || 'always');
const handleClick = ref(props.handleClick);
const infoPanelVisible = ref(true);
const helpVisible = ref(false);

const rootSize = ref<AspectRatio>([0, 0]);
const wrapperSize = ref<AspectRatio>([0, 0]);
const previousFullscreenRect = ref<DOMRect>();

const transform = ref<IGsTransform>({...defaultTransform});

const i18nConfig = computed<II18n>(() => getI18nConfig(props.i18n));

const transformChanged = computed(() => {
  const state = transform.value;
  return state.flipHorizontal !== defaultTransform.flipHorizontal ||
      state.flipVertical !== defaultTransform.flipVertical ||
      state.rotation !== defaultTransform.rotation ||
      state.scaleMode !== defaultTransform.scaleMode ||
      state.translateX !== defaultTransform.translateX ||
      state.translateY !== defaultTransform.translateY;
});

const isFullscreen = computed(() => {
  rootSize.value
  return isWebFullscreen.value || !!document.fullscreenElement;
});

const rtLayout = computed(() => isFullscreen.value ? rootSize.value[0] / rootSize.value[1] > 1 ? 'horizontal' : 'vertical' : currLayout.value);

const controlsVisible = computed(() => isHovering.value || controlVisibility.value === 'always' || listVisibility.value === 'always' && rtLayout.value === 'horizontal');

const fullscreen = () => {
  previousFullscreenRect.value = rootRef.value?.getBoundingClientRect();
  rootRef.value?.requestFullscreen?.()
}

const webFullscreen = () => {
  previousFullscreenRect.value = rootRef.value?.getBoundingClientRect();
  isWebFullscreen.value = true
}

const exitFullscreen = () => {
  isWebFullscreen.value = false;
  if (document.fullscreenElement) document.exitFullscreen?.();
};

const toggleListVisibility = () => listVisibility.value = listVisibility.value === 'hover' ? 'always' : 'hover';

const setLayout = (layout: LayoutMode) => currLayout.value = layout

const resetTransform = () => transform.value = {...defaultTransform}

const widgetContext = shallowRef<IGsWidgetContext>({
  get previousFullscreenRect() {
    return previousFullscreenRect.value;
  },
  get keyboardTarget() {
    return props.keyboardTarget
  },
  get aspectRatio() {
    return currentAspectRatio.value;
  },
  set aspectRatio(value: AspectRatioMode) {
    currentAspectRatio.value = value;
  },
  get i18n() {
    return i18nConfig.value;
  },
  get isFullscreen() {
    return isFullscreen.value;
  },
  get playerRoot() {
    return rootRef.value as HTMLElement;
  },
  get videoWrapper() {
    return wrapperRef.value as HTMLElement;
  },
  get wrapperSize() {
    return wrapperSize.value;
  },
  get rootSize() {
    return rootSize.value;
  },
  get layout() {
    return rtLayout.value;
  },
  get controlVisibility() {
    return controlVisibility.value;
  },
  set controlVisibility(value: VisibilityMode) {
    controlVisibility.value = value;
  },
  get listVisibility() {
    return listVisibility.value;
  },
  set listVisibility(value: VisibilityMode) {
    listVisibility.value = value;
  },
  get handleClick() {
    return handleClick.value;
  },
  set handleClick(value: boolean) {
    handleClick.value = value;
  },
  get infoPanelVisible() {
    return infoPanelVisible.value;
  },
  set infoPanelVisible(value: boolean) {
    infoPanelVisible.value = value;
  },
  get helpVisible() {
    return helpVisible.value;
  },
  set helpVisible(value: boolean) {
    helpVisible.value = value;
  },
  get transform() {
    return transform.value;
  },
  get transformChanged() {
    return transformChanged.value;
  },
  fullscreen,
  webFullscreen,
  exitFullscreen,
  setLayout,
  toggleListVisibility,
  resetTransform,
  updateRootSize: (size) => rootSize.value = size,
  updateWrapperSize: (size) => wrapperSize.value = size,
});

const widgets = computed(() => resolveWidgets(props));
const widgetProps = computed(() => ({
  core: coreRef.value,
  cxt: widgetContext.value,
  props: props
}))

onMounted(() => LogicManager.mount(widgetProps.value));

onBeforeUnmount(() => LogicManager.unmount(widgetProps.value));

defineExpose<IGsPlayerExpose>({
  get previousFullscreenRect() {
    return previousFullscreenRect.value;
  },
  get keyboardTarget() {
    return props.keyboardTarget
  },
  get core() {
    return coreRef.value;
  },
  get aspectRatio() {
    return currentAspectRatio.value;
  },
  set aspectRatio(value: AspectRatioMode) {
    currentAspectRatio.value = value;
  },
  get isFullscreen() {
    return isFullscreen.value;
  },
  get playerRoot() {
    return rootRef.value;
  },
  get videoWrapper() {
    return wrapperRef.value;
  },
  get wrapperSize() {
    return wrapperSize.value;
  },
  get rootSize() {
    return rootSize.value;
  },
  get layout() {
    return rtLayout.value;
  },
  get controlVisibility() {
    return controlVisibility.value;
  },
  set controlVisibility(value: VisibilityMode) {
    controlVisibility.value = value;
  },
  get listVisibility() {
    return listVisibility.value;
  },
  set listVisibility(value: VisibilityMode) {
    listVisibility.value = value;
  },
  get handleClick() {
    return handleClick.value;
  },
  set handleClick(value: boolean) {
    handleClick.value = value;
  },
  get infoPanelVisible() {
    return infoPanelVisible.value;
  },
  set infoPanelVisible(value: boolean) {
    infoPanelVisible.value = value;
  },
  get helpVisible() {
    return helpVisible.value;
  },
  set helpVisible(value: boolean) {
    helpVisible.value = value;
  },
  get i18n() {
    return i18nConfig.value;
  },
  fullscreen,
  webFullscreen,
  exitFullscreen,
  setLayout,
  toggleListVisibility,
  get transform() {
    return transform.value;
  },
  get transformChanged() {
    return transformChanged.value;
  },
  resetTransform,
});
</script>
