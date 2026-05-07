<template>
  <ul class="gs-playlist" ref="playlistRef" @click.stop>
    <component
        v-for="item in core.playlist"
        :key="item._id"
        :is="GsPlaylistItem"
        :current="item"
        :core="core"
        :cxt="cxt"
        :props="props"
    />
  </ul>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../../type';
import GsPlaylistItem from './GsPlaylistItem.vue';
import {ref, watch} from "vue";
import {wait} from "gs-base/timer";

const p = defineProps<IGsWidgetProps>();

const playlistRef = ref<HTMLUListElement>();

watch(() => p.core?.src?._id, () => {
  scrollToActiveItem();
});

watch(() => p.core?.playlist?.length, () => {
  scrollToActiveItem();
});


async function scrollToActiveItem() {
  if (!playlistRef.value) return;
  await wait(100)
  const activeItem = playlistRef.value.querySelector('.active');
  if (activeItem) {
    activeItem.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
}
</script>
