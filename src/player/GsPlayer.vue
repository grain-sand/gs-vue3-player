<template>
  <teleport :to="webFullscreenTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="[
          `layout-${effectiveLayout}`,
          {
            'is-web-fullscreen': isWebFullscreen,
            'gs-controls-visible': isControlsVisible
          }
        ]"
        ref="containerRef"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
      <div class="gs-player-main">
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
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch} from 'vue';
import {PlayerCore} from '../core';
import {
  AspectRatioMode,
  DefaultAspectRatio,
  DefaultControlVisibility,
  DefaultLayoutMode,
  DefaultRates,
  I18nName,
  IGsPlayerEmits,
  IGsPlayerExpose,
  IGsPlayerProps,
  IGsWidget,
  IGsWidgetContext,
  IGsWidgetProps,
  II18n,
  IPlayerCoreExpose,
  LayoutMode
} from '../type';
import {enUS, jaJP, koKR, zhCN, zhTW} from './i18n';
import {defaultLogics} from './logics';
import {GsControlBar, GsInfoPanel, GsPlayOverlay} from './widgets';
import {isVueComponent} from '../utils/vueComponent';

const props = withDefaults(defineProps<IGsPlayerProps>(), {
  i18n: () => zhCN,
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
const currentAspectRatio = ref<AspectRatioMode>(props.aspectRatio);
const forceUpdate = ref(0);
const isHovering = ref(false);

const i18nConfig = computed<II18n>(() => {
  if (typeof props.i18n === 'string') {
    const i18nMap: Record<I18nName, II18n> = {
      'zh-CN': zhCN,
      'zh-TW': zhTW,
      'en': enUS,
      'ja': jaJP,
      'ko': koKR,
      'auto': zhCN
    };
    const lang = props.i18n === 'auto' ?
        (navigator.language as I18nName) || 'zh-CN' :
        props.i18n;
    return i18nMap[lang] || zhCN;
  }
  return props.i18n;
});

const exposedCore = computed(() => coreRef.value);

const isFullscreen = computed(() => {
  return isWebFullscreen.value ||
      document.fullscreenElement !== null;
});

const effectiveLayout = computed(() => {
  forceUpdate.value;
  if (isFullscreen.value && containerRef.value) {
    const containerAspectRatio = containerRef.value.clientWidth / containerRef.value.clientHeight;
    return containerAspectRatio > 1 ? 'horizontal' : 'vertical';
  }
  return currentLayout.value;
});

const isControlsVisible = computed(() => {
  if (props.controlVisibility === 'always') {
    return true;
  }
  return isHovering.value;
});

function handleMouseEnter() {
  isHovering.value = true;
}

function handleMouseLeave() {
  isHovering.value = false;
}

const widgetContext = shallowRef<IGsWidgetContext>({
  get aspectRatio() {
    return currentAspectRatio.value;
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
  get layout() {
    return effectiveLayout.value;
  },
  get controlVisibility() {
    return props.controlVisibility;
  },
  fullscreen() {
    containerRef.value?.requestFullscreen?.();
  },
  async webFullscreen() {
    isWebFullscreen.value = true;
    await nextTick();
    forceUpdate.value++;
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
  }
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

const controlBarWidget = computed<ResolvedWidget | null>(() => {
  if (props.controlBar === null) return null;
  if (props.controlBar !== undefined && isVueComponent(props.controlBar)) {
    return {key: 'controlBar', component: props.controlBar as IGsWidget};
  }
  return {key: 'controlBar', component: GsControlBar};
});

const innerWidgets = computed<ResolvedWidget[]>(() => {
  const widgets: ResolvedWidget[] = [];

  if (props.playOverlay !== null) {
    const component = props.playOverlay !== undefined && isVueComponent(props.playOverlay)
      ? props.playOverlay
      : GsPlayOverlay;
    widgets.push({key: 'playOverlay', component});
  }

  const controlBar = controlBarWidget.value;
  if (controlBar) {
    widgets.push(controlBar);
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

const mergedLogics = computed(() => {
  const baseLogics = props.logics ?? defaultLogics;
  return [...baseLogics, ...(props.appendLogics || [])];
});


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

defineExpose<IGsPlayerExpose>({
  get core() {
    return coreRef.value!;
  },
  get aspectRatio() {
    return currentAspectRatio.value;
  },
  get isFullscreen() {
    return isFullscreen.value;
  },
  get container() {
    return containerRef.value!;
  },
  get layout() {
    return effectiveLayout.value;
  },
  get controlVisibility() {
    return props.controlVisibility;
  },
  get i18n() {
    return i18nConfig.value;
  },
  fullscreen: () => widgetContext.value.fullscreen(),
  webFullscreen: () => widgetContext.value.webFullscreen(),
  exitFullscreen: () => widgetContext.value.exitFullscreen(),
  setLayout: (layout: LayoutMode) => widgetContext.value.setLayout(layout)
});
</script>
