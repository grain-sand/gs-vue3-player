<template>
  <div
      :class="['gs-info-panel', {'has-word-handler':wordHandler,expand}]"
      v-show="cxt.infoPanelVisible"
      @click.stop.prevent=""
      @wheel.stop=''
      @dblclick.stop.prevent=""
      @mouseleave="onMouseleave"
      ref="panelRef"
      :style="{pointerEvents: expand ? 'auto' : 'none'}"
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
          @click="props.linkHandler(src.link, src,p)"
      />
      <GsButton
          v-if="props.downloadHandler"
          :icon="DownloadSvg"
          :title="cxt.i18n.titles.download"
          @click="props.downloadHandler?.(src,p)"
      />
    </div>
    <div
        :class="['gs-info-content', {'not-hovered': !hovered}]"
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
const wordHandler = computed(() => p.props.socioWordHandler);
const expand = computed(() => p.props.alwaysExpandInfoPanel || hovered.value);

const html = computed(() => {
  const text = src.value?.description || src.value?.title?.replace(/\n/g, '<br/>');
  if (!text || !wordHandler.value) {
    return text?.trim() || '';
  }
  return parseSocioWords(text)?.trim() || '';
});

const height = computed(() => {
  if (p.cxt.layout === 'vertical') {
    return '4.5em';
  }
  if (!html.value) {
    return '0';
  }
  if (!expand.value) {
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

const authorLink = (url: string) => p.props.linkHandler?.(url, src.value, p);

const reg = /([#@])[^\s<@#]+/g;

function parseSocioWords(text: string = ''): string {
  return text.replace(reg, (match, p1) => {
    return `<span class="gs-socio-word gs-${p1 === '@' ? 'mention' : 'hashtag'}">${match}</span>`;
  });
}

function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('gs-socio-word')) {
    const word = target.textContent || '';
    wordHandler.value?.(word, p.core?.src, p);
  }
}

function onMouseleave() {
  hovered.value = false;
  if (p.cxt?.layout !== 'horizontal') return;
  const {value: el} = contentRef;
  if (!el) return;
  el.scroll({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}
</script>
