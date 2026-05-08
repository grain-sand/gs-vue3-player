<template>
  <div class="gs-info-panel"
       v-if="cxt.infoPanelVisible"
       @click.stop.prevent=""
       @wheel.stop=''
       @dblclick.stop.prevent=""
  >
    <div class="gs-info-header">
      <GsAuthor
          v-if="core.src?.author"
          :author="core.src.author"
          :link-handler="(url)=>p.props.linkHandler?.(url, core.src)"
          class="gs-info-author"
      />
      <time
          v-if="shortDate"
          :datetime="fullDate"
          :class="{'gs-info-time-hover':timeHover}"
          @mouseenter="timeHover = true"
          @mouseleave="timeHover = false"
      >
        <DateSvg/>
        <span v-text="timeHover ? fullDate : shortDate"></span>
      </time>
      <GsButton
          v-if="core.src?.link"
          :icon="LinkSvg"
          :title="cxt.i18n.titles.openLink"
          @click="handleLinkClick"
      />
      <GsButton
          v-if="core.src?.downloadUrl&&p.props.downloadHandler"
          :icon="DownloadSvg"
          :title="cxt.i18n.titles.download"
          @click="p.props.downloadHandler(core?.src?.downloadUrl, core?.src)"
      />
    </div>
    <div
        class="gs-info-content"
        v-html="html"
        ref="contentRef"
        @click.stop.prevent="handleContentClick"
        @mouseleave="onMouseleave"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import {GsAuthor, GsButton} from "../../../component";
import {LinkSvg, DownloadSvg, DateSvg} from "../../../svgs";
import {computed, ref} from "vue";
import {formatDate} from "../../../util";

const contentRef = ref<HTMLDivElement>();

const timeHover = ref(false);

const p = defineProps<IGsWidgetProps>();

const src = computed(() => p.core?.src);

const shortDate = computed(() => src.value?.createdAt ? formatDate(src.value.createdAt, {i18n: p.cxt.i18n.date}) : '');
const fullDate = computed(() => src.value?.createdAt ? formatDate(src.value.createdAt, {
  i18n: p.cxt.i18n.date,
  omitYearThisYear: false,
  relativeTimeThreshold: null,
  shortYear: false,
  showTime: true
}) : '');

const html = computed(() => {
  const text = p.core?.src?.description || p.core?.src?.title?.replace(/\n/g, '<br/>');
  if (!text || !p.props.socioWordHandler) {
    return text;
  }
  return parseSocioWords(text);
});

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

function handleLinkClick() {
  const url = p.core?.src?.link;
  if (url) {
    const handler = p.props.linkHandler;
    if (handler) {
      handler(url, p.core?.src);
    } else {
      window.open(url);
    }
  }
}


function onMouseleave() {
  const {value: el} = contentRef;
  if (!el) return;
  el.scroll({
    left: 0,
    top: 0,
    behavior: 'smooth',
  })
}
</script>
