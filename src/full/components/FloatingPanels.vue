<template>
  <div class="gs-title-float-panel">
    <div ref="titlePanel"></div>
  </div>
  <div class="gs-right-float-panel" ref="rightPanel"></div>
</template>

<script lang="ts" setup>
import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import {IFloatingPanelsExpose} from "../type/ControlsExposes";
import {GsPlayerInjectKey, IGsPlayerInject} from "../type/IGsPlayerInject";
import {Timer} from "gs-base/timer";

const timer = new Timer(300);

import {AspectRatioMode, DefaultAspectRatio} from "../../type";
import {setStyleVars} from "../../util";

const api = inject<IGsPlayerInject>(GsPlayerInjectKey)!;
const titlePanel = ref<HTMLDivElement>()
const rightPanel = ref<HTMLDivElement>()
const aspectRatio = ref<AspectRatioMode>(api.props.aspectRatio || DefaultAspectRatio)
const rect = ref<DOMRectReadOnly>(<any>{})
const floating = ref(false)

const playerCoreHeight = computed(() => {
  const {width} = rect.value
  if (!width) return 240;
  const {value: mode} = aspectRatio
  if (mode === 'auto') {
    // 尝试从 current.src 获取 aspect_ratio
    const ratio = api.src.aspectRatio;
    if (ratio) {
      return width * ratio[1] / ratio[0] + 2;
    } else {
      return width * 9 / 16 + 2;
    }
  } else {
    const [w = 16, h = 9] = aspectRatio.value || [];
    return width * (Number(h) / Number(w)) + 2;
  }
});

const resizeObserver = new ResizeObserver(async ([e]) => {
  await timer.reWait()
  if (e.contentRect) {
    rect.value = e.contentRect
  }
  floating.value = api.isAnyFullscreen && rect.value.width > rect.value.height;
  if (floating.value) {
    setStyleVars(api.containerRef.value, {playerCoreHeight: '100%'});
  } else {
    setStyleVars(api.containerRef.value, {playerCoreHeight});
  }
})

onMounted(() => resizeObserver.observe(api.containerRef.value))
onUnmounted(() => resizeObserver.disconnect())


defineExpose<IFloatingPanelsExpose>({
  get floating() {
    return floating.value
  },
  get titlePanel() {
    return titlePanel.value!
  },
  get rightPanel() {
    return rightPanel.value!
  }
})
</script>
