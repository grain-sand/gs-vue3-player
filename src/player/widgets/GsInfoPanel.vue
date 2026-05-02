<template>
  <div class="gs-info-panel"
       @click.stop.prevent=""
       @wheel.stop=''
       @dblclick.stop.prevent=""
  >
    <div class="gs-info-header"
         v-if="core.src?.author">
      <GsAuthor
          :author="core.src.author"
          :link-handler="props.linkHandler"
          class="gs-info-author"
      />
    </div>
    <div
        class="gs-info-content"
        :title="title"
        v-html="html"
        @click.stop.prevent="handleContentClick"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {GsAuthor} from "../../component";
import {computed} from "vue";

const p = defineProps<IGsWidgetProps>();

const title = computed(() => p.core?.src?.description?.replace(/<[^>]+>/g, '') || p.core?.src?.title)

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
      p.props.socioWordHandler(word);
    }
  }
}
</script>
