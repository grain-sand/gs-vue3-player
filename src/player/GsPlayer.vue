<template>
  <teleport :to="webFullscreenTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="[
          `layout-${layout}`,
          {
            'is-web-fullscreen': isWebFullscreen,
            'gs-controls-visible': isControlsVisible
          }
        ]"
        ref="containerRef"
    >
      <div class="gs-player-main"
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

        <template v-if="exposedCore">
          <component
              v-if="controlBarWidget"
              :is="controlBarWidget"
              :core="exposedCore"
              :cxt="widgetContext"
              :props="props"
              @mouseenter="isHovering= true"
              @mouseleave="isHovering= false"
          />

          <component
              v-for="widget in innerWidgets"
              :is="widget"
              :core="exposedCore"
              :cxt="widgetContext"
              :props="props"
          />
        </template>
      </div>

      <template v-if="exposedCore">
        <component
            v-for="widget in outerWidgets"
            :is="widget"
            :core="exposedCore"
            :cxt="widgetContext"
            :props="props"
        />
      </template>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import {PlayerCore} from '../core';
import {
  AspectRatioMode,
  DefaultAspectRatio,
  DefaultControlVisibility,
  DefaultI18nName,
  DefaultLayoutMode,
  DefaultListContainerVisibility,
  DefaultRates,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsWidget,
  IGsWidgetContext,
  IGsWidgetProps,
  II18n,
  IPlayerCoreExpose,
  ITransformState,
  LayoutMode,
  VisibilityMode
} from '../type';
import {getI18nConfig} from './i18n';
import {defaultLogics} from './logics';
import {GsControlBar, GsInfoPanel, GsListContainer, GsPlayOverlay} from './widgets';
import {isVueComponent} from '../util';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  i18n: () => DefaultI18nName,
  aspectRatio: <any>DefaultAspectRatio,
  layout: DefaultLayoutMode,
  handleClick: true,
  handleDblClick: true,
  rates: () => [...DefaultRates],
  controlVisibility: DefaultControlVisibility,
  webFullscreenTarget: () => document.body,
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

const containerRef = ref<HTMLDivElement>();
const coreRef = ref<IPlayerCoreExpose>();
const isWebFullscreen = ref(false);
const currentLayout = ref<LayoutMode>(props.layout);
const originalLayout = ref<LayoutMode>(props.layout);
const currentAspectRatio = ref<AspectRatioMode>(props.aspectRatio || DefaultAspectRatio);
const isHovering = ref(false);
const controlVisibility = ref<VisibilityMode>(props.controlVisibility);
const listVisibility = ref<VisibilityMode>(props.listVisibility || 'always');
const handleClick = ref(props.handleClick);
const infoPanelVisible = ref(true);

const containerWidth = ref(0);
const containerHeight = ref(0);

const i18nConfig = computed<II18n>(() => getI18nConfig(props.i18n));

const DEFAULT_TRANSFORM_STATE: Readonly<ITransformState> = Object.freeze({
  draggable: false,
  flipHorizontal: false,
  flipVertical: false,
  rotation: 0,
  scaleMode: 'auto',
  translateX: 0,
  translateY: 0
});

const transformState = ref<ITransformState>({...DEFAULT_TRANSFORM_STATE});

const hasTransformChanged = computed(() => {
  const state = transformState.value;
  return state.flipHorizontal || state.flipVertical || state.rotation !== 0 ||
      state.scaleMode !== 'auto' || state.translateX !== 0 || state.translateY !== 0;
});

const exposedCore = computed(() => coreRef.value);

const isFullscreen = computed(() => {
  containerWidth.value
  containerHeight.value
  return isWebFullscreen.value || !!document.fullscreenElement;
});

const layout = computed(() => {
  if (isFullscreen.value) {
    const containerAspectRatio = containerWidth.value / containerHeight.value;
    return containerAspectRatio > 1 ? 'horizontal' : 'vertical';
  }
  return currentLayout.value;
});

const isControlsVisible = computed(() => {
  if (
      controlVisibility.value === 'always'
      || listVisibility.value === 'always' && layout.value === 'horizontal'
  ) {
    return true;
  }
  return isHovering.value;
});

const updateContainerSize = (width: number, height: number) => {
  containerWidth.value = width;
  containerHeight.value = height;
};

const fullscreen = () => {
  containerRef.value?.requestFullscreen?.();
};

const webFullscreen = () => {
  isWebFullscreen.value = true;
};

const exitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  }
  isWebFullscreen.value = false;
};

const setLayout = (layout: LayoutMode) => {
  if (!isFullscreen.value) {
    currentLayout.value = layout;
    originalLayout.value = layout;
  }
};

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
  get container() {
    return containerRef.value as HTMLElement;
  },
  get containerWidth() {
    return containerWidth.value;
  },
  get containerHeight() {
    return containerHeight.value;
  },
  updateContainerSize,
  get layout() {
    return layout.value;
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
  resetTransform: () => {
    transformState.value = {...DEFAULT_TRANSFORM_STATE};
  },
});

watch(isFullscreen, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    originalLayout.value = currentLayout.value;
  } else if (!newVal && oldVal) {
    currentLayout.value = originalLayout.value;
  }
});

const controlBarWidget = computed<IGsWidget | null>(() => {
  if (props.controlBar === null) return null;
  if (isVueComponent(props.controlBar)) {
    return props.controlBar;
  }
  return GsControlBar;
});

const overlayWidget = computed<IGsWidget>(() => props.playOverlay !== null ? isVueComponent(props.playOverlay) ? props.playOverlay : GsPlayOverlay : null);

const infoPanelWidget = computed<IGsWidget>(() => props.infoPanel !== null ? isVueComponent(props.infoPanel) ? props.infoPanel : GsInfoPanel : null);

const listContainerWidget = computed<IGsWidget>(() => props.listContainer !== null ? isVueComponent(props.listContainer) ? props.listContainer : GsListContainer : null);

const innerWidgets = computed<IGsWidget[]>(() => {
  const iws = props.appendInnerWidgets;
  const widgets = iws ? Array.isArray(iws) ? iws : [iws] : [];
  if (overlayWidget.value) widgets.push(overlayWidget.value);
  return widgets;
});

const outerWidgets = computed<IGsWidget[]>(() => {
  const ows = props.appendOuterWidgets;
  const widgets = ows ? Array.isArray(ows) ? ows : [ows] : [];
  if (infoPanelWidget.value) widgets.push(infoPanelWidget.value);
  if (listContainerWidget.value) widgets.push(listContainerWidget.value);
  return widgets;
});

const mergedLogics = computed(() => {
  const baseLogics = props.logics ?? defaultLogics;
  return [...baseLogics, ...(props.appendLogics || [])];
});

function toggleListVisibility() {
  listVisibility.value = listVisibility.value === 'hover' ? 'always' : 'hover';
}

onMounted(async () => {
  const widgetProps: IGsWidgetProps = {
    core: coreRef.value!,
    cxt: widgetContext.value,
    props: props
  };
  for (const logic of mergedLogics.value) {
    await logic.mount(widgetProps);
  }
});

onBeforeUnmount(() => {
  const widgetProps: IGsWidgetProps = {
    core: coreRef.value!,
    cxt: widgetContext.value,
    props: props
  };
  for (const logic of mergedLogics.value) {
    if (logic.unmount) {
      logic.unmount(widgetProps);
    }
  }
});

watch(() => isFullscreen, async (v) => {
  const core = coreRef.value;
  if (!core)
    if (v) {
      core.toBestQuality({
        width: containerWidth.value,
        height: containerHeight.value,
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
  get container() {
    return containerRef.value!;
  },
  get containerWidth() {
    return containerWidth.value;
  },
  get containerHeight() {
    return containerHeight.value;
  },
  get layout() {
    return layout.value;
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
  resetTransform: () => {
    transformState.value = {...DEFAULT_TRANSFORM_STATE};
  },
});
</script>
