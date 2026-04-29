<template>
  <teleport :to="webFullscreenTarget" :disabled="!isWebFullscreen">
    <div
        class="gs-player"
        :class="{ 'is-web-fullscreen': isWebFullscreen }"
        ref="containerRef"
        @click="handlePlayerClick"
        @dblclick="handlePlayerDblClick"
        @wheel.stop="handlePlayerWheel"
    >
      <PlayerCore
          ref="coreRef"
          :src="props.src"
          :hls-config="props.hlsConfig"
          :quality="props.quality"
          :use-browser-hls="props.useBrowserHls"
          :rate="props.rate"
          :volume="props.volume"
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

      <template v-for="widget in resolvedWidgets" :key="widget.key">
        <component
            :is="widget.component"
            :core="exposedCore"
            :cxt="widgetContext"
            :props="props"
        />
      </template>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, shallowRef} from 'vue';
import PlayerCore from '../core/PlayerCore.vue';
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
const currentAspectRatio = ref<AspectRatioMode>(props.aspectRatio);

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
    return currentLayout.value;
  },
  get controlVisibility() {
    return props.controlVisibility;
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
    currentLayout.value = layout;
  }
});

interface ResolvedWidget {
  key: string;
  component: IGsWidget;
}

const resolvedWidgets = computed<ResolvedWidget[]>(() => {
  const widgets: ResolvedWidget[] = [];
  return widgets;
});

const mergedLogics = computed(() => {
  return [...(props.logics || []), ...(props.appendLogics || [])];
});

const handlePlayerClick = async () => {
  if (!props.handleClick || !coreRef.value) return;
  if (coreRef.value.muted) {
    await coreRef.value.unmute();
    await coreRef.value.play();
  } else {
    await coreRef.value.togglePlay();
  }
};

const handlePlayerDblClick = () => {
  if (!props.handleDblClick) return;
  if (isFullscreen.value) {
    widgetContext.value.exitFullscreen();
  } else {
    widgetContext.value.webFullscreen();
  }
};

const handlePlayerWheel = (e: WheelEvent) => {
  if (props.disableWheelNavigation) return;
  e.preventDefault();
  if (e.deltaY < 0) {
    coreRef.value?.playPre();
  } else {
    coreRef.value?.playNext();
  }
};



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
    return currentLayout.value;
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
