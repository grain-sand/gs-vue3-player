<template>
  <div class="gs-info-panel"
       v-show="cxt.infoPanelVisible"
       @click.stop.prevent=""
       @wheel.stop=''
       @dblclick.stop.prevent=""
       @mouseleave="onMouseleave"
       :class="{hovered}"
       ref="panelRef"
       :style="{pointerEvents: hovered ? 'auto' : 'none'}"
  >
    <div class="gs-info-header">
      <GsAuthor
          v-if="src?.author"
          :author="src.author"
          :link-handler="authorLink"
          class="gs-info-author"
      />
      <GsDate
          v-if="src?.createdAt"
          :date="src.createdAt"
          :i18n="cxt.i18n.date"
      />
      <GsButton
          v-if="src?.link&&props.linkHandler"
          :icon="LinkSvg"
          :title="src.link"
          @click="props.linkHandler(src.link, src)"
      />
      <GsButton
          v-if="src?.downloadUrl && props.downloadHandler"
          :icon="DownloadSvg"
          :title="cxt.i18n.titles.download"
          @click="props.downloadHandler?.(src.downloadUrl, src)"
      />
    </div>
    <div
        class="gs-info-content"
        v-html="html"
        ref="contentRef"
        @click.stop.prevent="handleContentClick"
        @mouseenter="hovered = true"
        :style="{height}"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {GsAuthor, GsButton, GsDate} from "../../../component";
import {LinkSvg, DownloadSvg} from "../../../svgs";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {measureRenderedText} from "../../../util";

let resizeObserver: ResizeObserver;

const panelRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const panelWidth = ref(0);
const hovered = ref(false);

const p = defineProps<IGsWidgetProps>();

const src = computed(() => p.core?.src);

const html = computed(() => {
  const text = src.value?.description || src.value?.title?.replace(/\n/g, '<br/>');
  if (!text || !p.props.socioWordHandler) {
    return text;
  }
  return parseSocioWords(text);
});

const height = computed(() => {
  if (p.cxt.layout === 'vertical') {
    return '4.5em';
  }
  if (!hovered.value) {
    return '1.8em';
  }
  const maxWidth = `${panelWidth.value}px`
  const {lines} = measureRenderedText({
    text: html.value,
    className: 'gs-info-content',
    style: {maxWidth, lineHeight: '1.8em'}
  });
  return `${lines * 1.8}em`
});


onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]) => panelWidth.value = entry.contentRect.width);
  resizeObserver.observe(panelRef.value);
})

onUnmounted(() => {
  resizeObserver?.disconnect?.();
  resizeObserver = null;
})

const authorLink = (url: string) => p.props.linkHandler?.(url, src.value);

function parseSocioWords(text: string): string {
  let result = text;
  result = result.replace(/#(\w+)/g, '<span class="gs-socio-word gs-hashtag">#$1</span>');
  result = result.replace(/@(\w+)/g, '<span class="gs-socio-word gs-mention">@$1</span>');
  return result;
}

function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('gs-socio-word')) {
    const word = target.textContent || '';
    if (p.props.socioWordHandler) {
      p.props.socioWordHandler(word, p.core?.src);
    }
  }
}

function onMouseleave() {
  hovered.value = false;
  const {value: el} = contentRef;
  if (!el) return;
  el.scroll({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}
</script>
