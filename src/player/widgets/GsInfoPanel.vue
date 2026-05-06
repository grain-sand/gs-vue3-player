<template>
  <div class="gs-info-panel"
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
import {IGsWidgetProps} from '../../type';
import {GsAuthor, GsButton} from "../../component";
import {LinkSvg, DownloadSvg} from "../../svgs";
import {computed, ref} from "vue";

const contentRef = ref<HTMLDivElement>();

const p = defineProps<IGsWidgetProps>();

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
