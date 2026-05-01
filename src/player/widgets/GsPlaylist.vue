<template>
  <div class="gs-playlist">
    <ul class="gs-playlist-items">
      <li
          v-for="(item, index) in playlist"
          :key="item._id"
          class="gs-playlist-item"
          :class="{ active: index === currentIndex }"
          @click="handleItemClick(index)"
      >
        <div class="gs-playlist-item-thumb">
          <svg v-if="index === currentIndex && isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        </div>
        <div class="gs-playlist-item-info">
          <div class="gs-playlist-item-title">{{ getTitle(item) }}</div>
          <div class="gs-playlist-item-author" v-if="showAuthor(item)">
            {{ getAuthor(item) }}
          </div>
        </div>
        <div v-if="showTime(item)" class="gs-playlist-item-time">
          {{ formatDuration(item.duration) }}
        </div>
        <button
            class="gs-playlist-item-remove"
            @click.stop="handleRemove(item)"
            :title="cxt.i18n.remove || 'Remove'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {IGsWidgetProps} from '../../type';
import {ISourceWrapper} from '../../type';
import {formatTime} from '../../util';

const props = defineProps<IGsWidgetProps>();

const cxt = props.cxt;

const playlist = computed(() => props.core.playlist);

const currentIndex = computed(() => props.core.index);

const isPlaying = computed(() => props.core.playing);

function getTitle(item: ISourceWrapper): string {
  if (typeof item.src === 'string') return '';
  return item.title || '';
}

function getAuthor(item: ISourceWrapper): string {
  if (typeof item.src === 'string') return '';
  return item.author?.name || '';
}

function showAuthor(item: ISourceWrapper): boolean {
  if (typeof item.src === 'string') return false;
  return !!item.author?.name;
}

function showTime(item: ISourceWrapper): boolean {
  return item.duration !== undefined && item.duration > 0;
}

function formatDuration(duration?: number): string {
  if (!duration) return '';
  return formatTime(duration);
}

function handleItemClick(index: number) {
  if (index !== currentIndex.value) {
    const item = playlist.value[index];
    if (item) {
      props.core.setSrc(item.src);
      props.core.play();
    }
  }
}

function handleRemove(item: ISourceWrapper) {
  props.core.removeSrc(item);
}
</script>
