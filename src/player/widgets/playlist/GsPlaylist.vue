<template>
  <div
      class="gs-playlist"
      ref="playlistRef"
      @scrollend="scrollTop = playlistRef.scrollTop"
      @click.stop
      @mouseenter="hovered=true"
      @mouseleave="hovered=false"
  >
    <ul :style="{height: (core.playlist?.length||0)*54 + 'px'}">
      <component
          v-for="({item, index}) in list"
          :key="item._id"
          :index="index"
          :is="GsPlaylistItem"
          :current="item"
          :core="core"
          :cxt="cxt"
          :props="props"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps, ISourceWrapper} from '../../../type';
import GsPlaylistItem from './GsPlaylistItem.vue';
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {Timer} from "gs-base/timer";

const p = defineProps<IGsWidgetProps>();

const playlistRef = ref<HTMLUListElement>();
const height = ref(0), scrollTop = ref(0);
const hovered = ref(false);
const timer = new Timer(50);

const list = computed<{
  item: ISourceWrapper,
  index: number
}[]>(() => {
  const arr = [];
  const x = scrollTop.value, h = height.value;
  const top = x - h/2, bottom = x + h * 2;
  p.core?.playlist.forEach((item, index) => {
    const y = index * 54;
    if (y + 54 >= top && y - 54 <= bottom) {
      arr.push({item, index});
    }
  });
  return arr;
});

let resizeObserver: ResizeObserver;

onMounted(() => {
  resizeObserver = new ResizeObserver(([entry]: ResizeObserverEntry[]) => {
    height.value = entry.contentRect.height
    scrollTop.value = 0;
    scrollToActiveItem()
  });
  resizeObserver.observe(playlistRef.value);
})

onUnmounted(() => {
  resizeObserver.disconnect()
  resizeObserver = null;
});

watch(() => p.core?.src?._id, scrollToActiveItem);
watch(() => p.core?.playlist?.length, scrollToActiveItem);

async function scrollToActiveItem() {
  if (!playlistRef.value) return;
  await timer.reWait();
  if (hovered.value) return;
  const index = p.core?.index || 0;
  const y = index * 54;
  const st = scrollTop.value, h = height.value;
  if (y > st && y + 54 < st + h) {
    return;
  }
  const top = y - h / 2 + 27;
  playlistRef.value.scrollTo({top, behavior: 'smooth'});
}
</script>
