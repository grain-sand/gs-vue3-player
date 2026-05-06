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
            @src-change="trigger('srcChange', $event)"
            @src-remove="trigger('srcRemove', $event)"
            @volume-change="trigger('volumeChange', $event)"
            @muted-change="trigger('mutedChange', $event)"
            @rate-change="trigger('rateChange', $event)"
            @mode-change="trigger('modeChange', $event)"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseLeave"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        />

        <component
            v-if="controlBarWidget && exposedCore"
            :is="controlBarWidget"
            :core="exposedCore"
            :cxt="widgetContext"
            :props="props"
            @mouseenter="isHovering= true"
            @mouseleave="isHovering= false"
        />

        <template v-for="widget in innerWidgets" :key="widget.key">
          <component
              v-if="exposedCore"
              :is="widget.component"
              :core="exposedCore"
              :cxt="widgetContext"
              :props="props"
          />
        </template>
      </div>

      <div class="gs-player-panels">
        <template v-for="widget in outerWidgets" :key="widget.key">
          <component
              v-if="exposedCore"
              :is="widget.component"
              :core="exposedCore"
              :cxt="widgetContext"
              :props="props"
          />
        </template>
      </div>

      <component
          v-if="listContainerWidget && exposedCore"
          :is="listContainerWidget"
          :core="exposedCore"
          :cxt="widgetContext"
          :props="props"
      />
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
  DefaultLayoutMode,
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
  i18n: () => 'auto',
  aspectRatio: <any>DefaultAspectRatio,
  layout: DefaultLayoutMode,
  handleClick: true,
  handleDblClick: true,
  rates: () => [...DefaultRates],
  controlVisibility: DefaultControlVisibility,
  webFullscreenTarget: () => document.body,
  keyboardTarget: '.gs-player',
  disableWheelNavigation: false
});

const emit = defineEmits<IGsPlayerEmits>();

function trigger<T extends keyof IGsPlayerEmits>(e: T, arg: Parameters<IGsPlayerEmits[T]>[0]) {
  // @ts-ignore
  emit(e, arg);
}

const containerRef = ref<HTMLDivElement>();
const coreRef = ref<IPlayerCoreExpose>();
const isWebFullscreen = ref(false);
const currentLayout = ref<LayoutMode>(props.layout);
const originalLayout = ref<LayoutMode>(props.layout);
const currentAspectRatio = ref<AspectRatioMode>(props.aspectRatio||DefaultAspectRatio);
const isHovering = ref(false);
const controlVisibility = ref<VisibilityMode>(props.controlVisibility);
const listVisibility = ref<VisibilityMode>(props.listVisibility || 'always');

const containerWidth = ref(0);
const containerHeight = ref(0);

const i18nConfig = computed<II18n>(() => getI18nConfig(props.i18n));

const transformState = ref<ITransformState>({
  draggable: false,
  flipHorizontal: false,
  flipVertical: false,
  rotation: 0,
  scaleMode: 'auto',
  translateX: 0,
  translateY: 0
});

const isDragging = ref(false);
const startPos = ref({ x: 0, y: 0 });
const startTranslate = ref({ x: 0, y: 0 });

const resetTransform = () => {
  transformState.value = {
    draggable: false,
    flipHorizontal: false,
    flipVertical: false,
    rotation: 0,
    scaleMode: 'auto',
    translateX: 0,
    translateY: 0
  };
  updateTransformStyle();
};

const toggleDraggable = () => {
  transformState.value.draggable = !transformState.value.draggable;
};

const toggleFlipHorizontal = () => {
  transformState.value.flipHorizontal = !transformState.value.flipHorizontal;
  updateTransformStyle();
};

const toggleFlipVertical = () => {
  transformState.value.flipVertical = !transformState.value.flipVertical;
  updateTransformStyle();
};

const rotate90 = () => {
  transformState.value.rotation = (transformState.value.rotation + 90) % 360;
  updateTransformStyle();
};

const setScaleMode = (mode: ITransformState['scaleMode']) => {
  transformState.value.scaleMode = mode;
  updateTransformStyle();
};

const updateTranslate = (x: number, y: number) => {
  transformState.value.translateX = x;
  transformState.value.translateY = y;
  updateTransformStyle();
};

const updateTransformStyle = () => {
  const core = coreRef.value;
  if (!core) return;

  const state = transformState.value;
  const scale = state.scaleMode === '2x' ? 2 : state.scaleMode === '1.5x' ? 1.5 : 1;

  const transforms: string[] = [];

  if (state.scaleMode === 'fit') {
    transforms.push('scale(1)');
  } else {
    transforms.push(`scale(${scale})`);
  }

  if (state.flipHorizontal) {
    transforms.push('scaleX(-1)');
  }

  if (state.flipVertical) {
    transforms.push('scaleY(-1)');
  }

  if (state.rotation !== 0) {
    transforms.push(`rotate(${state.rotation}deg)`);
  }

  if (state.translateX !== 0 || state.translateY !== 0) {
    transforms.push(`translate(${state.translateX}px, ${state.translateY}px)`);
  }

  core.style.transform = transforms.join(' ');
};

const onMouseDown = (e: MouseEvent) => {
  if (!transformState.value.draggable) return;
  isDragging.value = true;
  startPos.value = { x: e.clientX, y: e.clientY };
  startTranslate.value = { x: transformState.value.translateX, y: transformState.value.translateY };
  e.preventDefault();
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const dx = e.clientX - startPos.value.x;
  const dy = e.clientY - startPos.value.y;
  transformState.value.translateX = startTranslate.value.x + dx;
  transformState.value.translateY = startTranslate.value.y + dy;
  updateTransformStyle();
};

const onMouseUp = () => {
  isDragging.value = false;
};

const onMouseLeave = () => {
  isDragging.value = false;
};

const onTouchStart = (e: TouchEvent) => {
  if (!transformState.value.draggable || e.touches.length === 0) return;
  isDragging.value = true;
  const touch = e.touches[0];
  startPos.value = { x: touch.clientX, y: touch.clientY };
  startTranslate.value = { x: transformState.value.translateX, y: transformState.value.translateY };
  e.preventDefault();
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length === 0) return;
  const touch = e.touches[0];
  const dx = touch.clientX - startPos.value.x;
  const dy = touch.clientY - startPos.value.y;
  transformState.value.translateX = startTranslate.value.x + dx;
  transformState.value.translateY = startTranslate.value.y + dy;
  updateTransformStyle();
};

const onTouchEnd = () => {
  isDragging.value = false;
};

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
  fullscreen() {
    containerRef.value?.requestFullscreen?.();
  },
  webFullscreen() {
    isWebFullscreen.value = true;
  },
  exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    isWebFullscreen.value = false;
  },
  setLayout(layout: LayoutMode) {
    if (!isFullscreen.value) {
      currentLayout.value = layout;
      originalLayout.value = layout;
    }
  },
  toggleListVisibility,
  get transformState() {
    return transformState.value;
  },
  resetTransform,
  toggleDraggable,
  toggleFlipHorizontal,
  toggleFlipVertical,
  rotate90,
  setScaleMode,
  updateTranslate
});

watch(isFullscreen, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    originalLayout.value = currentLayout.value;
  } else if (!newVal && oldVal) {
    currentLayout.value = originalLayout.value;
  }
});

interface ResolvedWidget {
  key: string;
  component: IGsWidget;
}

const controlBarWidget = computed<IGsWidget | null>(() => {
  if (props.controlBar === null) return null;
  if (isVueComponent(props.controlBar)) {
    return props.controlBar;
  }
  return GsControlBar;
});

const innerWidgets = computed<ResolvedWidget[]>(() => {
  const widgets: ResolvedWidget[] = [];

  if (props.playOverlay !== null) {
    const component = props.playOverlay !== undefined && isVueComponent(props.playOverlay)
        ? props.playOverlay
        : GsPlayOverlay;
    widgets.push({key: 'playOverlay', component});
  }

  return widgets;
});

const outerWidgets = computed<ResolvedWidget[]>(() => {
  const widgets: ResolvedWidget[] = [];

  if (props.infoPanel !== null) {
    const component = props.infoPanel !== undefined && isVueComponent(props.infoPanel)
        ? props.infoPanel
        : GsInfoPanel;
    widgets.push({key: 'infoPanel', component});
  }

  return widgets;
});

const listContainerWidget = computed<IGsWidget | null>(() => {
  if (props.listContainer === null) return null;
  if (isVueComponent(props.listContainer)) {
    return props.listContainer;
  }
  return GsListContainer;
});

const mergedLogics = computed(() => {
  const baseLogics = props.logics ?? defaultLogics;
  return [...baseLogics, ...(props.appendLogics || [])];
});

function toggleListVisibility() {
  listVisibility.value = listVisibility.value === 'hover' ? 'always' : 'hover';
}

onMounted(async () => {
  for (const logic of mergedLogics.value) {
    const widgetProps: IGsWidgetProps = {
      core: coreRef.value!,
      cxt: widgetContext.value,
      props: props
    };
    await logic.mount(widgetProps);
  }
});

onBeforeUnmount(() => {
  for (const logic of mergedLogics.value) {
    const widgetProps: IGsWidgetProps = {
      core: coreRef.value!,
      cxt: widgetContext.value,
      props: props
    };
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
  get i18n() {
    return i18nConfig.value;
  },
  fullscreen: () => widgetContext.value.fullscreen(),
  webFullscreen: () => widgetContext.value.webFullscreen(),
  exitFullscreen: () => widgetContext.value.exitFullscreen(),
  setLayout: (layout: LayoutMode) => widgetContext.value.setLayout(layout),
  toggleListVisibility,
  get transformState() {
    return transformState.value;
  },
  resetTransform,
  toggleDraggable,
  toggleFlipHorizontal,
  toggleFlipVertical,
  rotate90,
  setScaleMode,
  updateTranslate
});
</script>
