<template>
  <div class="gs-info-panel">
    <div class="gs-info-header">
      <a v-if="currentLink" class="gs-info-link" @click.stop.prevent="handleLinkClick">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </a>
      <GsAuthor
          v-if="currentAuthor"
          :author="currentAuthor"
          :link-handler="props.props.linkHandler"
          class="gs-info-author"
      />
    </div>
    <div class="gs-info-content">
      <div class="gs-info-title" v-text="currentTitle"></div>
      <div v-if="currentViewCount || currentDate" class="gs-info-meta">
        <span v-if="currentViewCount">{{ currentViewCount }}</span>
        <span v-if="currentDate">{{ currentDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import {GsAuthor} from "../../component";

const props = defineProps<IGsWidgetProps>();

const i18n = computed(() => props.cxt.i18n);

const currentTitle = computed(() => {
  const src = props.core?.src;
  if (!src) return '';
  if (typeof src === 'string') return '';
  return src.title || '';
});

const currentAuthor = computed(() => {
  const src = props.core?.src;
  if (!src || typeof src === 'string') return null;
  return src.author;
});

const currentViewCount = computed(() => {
  const src = props.core?.src;
  if (!src || typeof src === 'string') return null;
  return src.data?.viewCount || null;
});

const currentDate = computed(() => {
  const src = props.core?.src;
  if (!src || typeof src === 'string') return null;
  return src.data?.date || null;
});

const currentLink = computed(() => {
  const src = props.core?.src;
  if (!src || typeof src === 'string') return null;
  return src.link || null;
});

function handleLinkClick() {
  if (currentLink.value) {
    const handler = props.props.linkHandler || window.open;
    handler(currentLink.value);
  }
}
</script>
