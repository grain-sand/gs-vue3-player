<template>
  <teleport :to="pageRoot" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="[
          `layout-${rtLayout}`,
          {
            'is-web-fullscreen': isWebFullscreen,
            'gs-controls-visible': isControlsVisible
          }
        ]"
        ref="rootRef"
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
            @src-change="handleSrcChange"
            @src-remove="trigger('srcRemove', $event)"
            @volume-change="trigger('volumeChange', $event)"
            @muted-change="trigger('mutedChange', $event)"
            @rate-change="trigger('rateChange', $event)"
            @mode-change="trigger('modeChange', $event)"
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
import {computed, onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import {PlayerCore} from '../core';
import {
  AspectRatio,
  AspectRatioMode,
  DefaultAspectRatio,
  DefaultControlVisibility,
  DefaultI18nName,
  DefaultLayoutMode,
  DefaultListContainerVisibility,
  DefaultRates,
  DefaultTransformState,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsWidgetContext,
  II18n,
  IPlayerCoreExpose,
  ITransformState,
  LayoutMode,
  VisibilityMode
} from '../type';
import {getI18nConfig} from './i18n';
import {defaultLogics} from './logics';
import {resolveWidgets} from './widgets';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  i18n: () => DefaultI18nName,
  aspectRatio: <any>DefaultAspectRatio,
  layout: DefaultLayoutMode,
  handleClick: true,
  handleDblClick: true,
  rates: () => [...DefaultRates],
  controlVisibility: DefaultControlVisibility,
  pageRoot: () => document.body,
  keyboardTarget: '.gs-player',
  disableWheelNavigation: false,
  listVisibility: DefaultListContainerVisibility,
  infoPanelVisible: true,
});

const emit = defineEmits<IGsPlayerEmits>();

function trigger<T extends keyof IGsPlayerEmits>(e: T, arg: Parameters<IGsPlayerEmits[T]>[0]) {
  // @ts-ignore
  emit(e, arg);
}

function handleSrcChange(src: any) {
  trigger('srcChange', src);
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
const helpPanelVisible = ref(false);

const rootSize = ref<AspectRatio>([0, 0]);
const wrapperSize = ref<AspectRatio>([0, 0]);

const transformState = ref<ITransformState>({...DefaultTransformState});

const i18nConfig = computed<II18n>(() => getI18nConfig(props.i18n));

const hasTransformChanged = computed(() => {
  const state = transformState.value;
  return state.flipHorizontal || state.flipVertical || state.rotation !== 0 ||
      state.scaleMode !== 'auto' || state.translateX !== 0 || state.translateY !== 0;
});

const isFullscreen = computed(() => {
  rootSize.value
  return isWebFullscreen.value || !!document.fullscreenElement;
});

const rtLayout = computed(() => {
  if (isFullscreen.value) {
    const containerAspectRatio = rootSize.value[0] / rootSize.value[1];
    return containerAspectRatio > 1 ? 'horizontal' : 'vertical';
  }
  return currLayout.value;
});

const isControlsVisible = computed(() => {
  if (
      controlVisibility.value === 'always'
      || listVisibility.value === 'always' && rtLayout.value === 'horizontal'
  ) {
    return true;
  }
  return isHovering.value;
});


const fullscreen = () => rootRef.value?.requestFullscreen?.()

const webFullscreen = () => isWebFullscreen.value = true

const exitFullscreen = () => {
  isWebFullscreen.value = false;
  if (document.fullscreenElement) document.exitFullscreen?.();
};

const toggleListVisibility = () => listVisibility.value = listVisibility.value === 'hover' ? 'always' : 'hover';

const setLayout = (layout: LayoutMode) => currLayout.value = layout

const resetTransform = () => transformState.value = {...DefaultTransformState}

const widgetContext = shallowRef<IGsWidgetContext>({
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
  get helpPanelVisible() {
    return helpPanelVisible.value;
  },
  set helpPanelVisible(value: boolean) {
    helpPanelVisible.value = value;
  },
  get transformState() {
    return transformState.value;
  },
  get hasTransformChanged() {
    return hasTransformChanged.value;
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
  core: coreRef.value!,
  cxt: widgetContext.value,
  props: props
}))

const mergedLogics = computed(() => {
  const baseLogics = props.logics ?? defaultLogics;
  return [...baseLogics, ...(props.appendLogics || [])];
});


onMounted(async () => {
  for (const logic of mergedLogics.value) {
    await logic.mount(widgetProps.value);
  }
});

onBeforeUnmount(() => {
  for (const logic of mergedLogics.value) {
    if (logic.unmount) {
      logic.unmount(widgetProps.value);
    }
  }
});

watch(() => isFullscreen, async (v) => {
  const core = coreRef.value;
  if (!core)
    if (v) {
      core.toBestQuality({
        width: rootSize.value[0],
        height: rootSize.value[1],
      })
    } else {
      core.autoQualityHls();
    }
})

defineExpose<IGsPlayerExpose>({
  get core() {
    return coreRef.value!;
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
    return rootRef.value!;
  },
  get videoWrapper() {
    return wrapperRef.value!;
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
  get helpPanelVisible() {
    return helpPanelVisible.value;
  },
  set helpPanelVisible(value: boolean) {
    helpPanelVisible.value = value;
  },
  get i18n() {
    return i18nConfig.value;
  },
  fullscreen,
  webFullscreen,
  exitFullscreen,
  setLayout,
  toggleListVisibility,
  get transformState() {
    return transformState.value;
  },
  get hasTransformChanged() {
    return hasTransformChanged.value;
  },
  resetTransform,
});
</script>
