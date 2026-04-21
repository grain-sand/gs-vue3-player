<template>
  <ul class="gs-playlist" ref="playlistRef">
    <li v-for="item in api.playlist" :key="item._id"
        :class="{'active': item._id === api.src?._id}"

    >
      <header v-if="item.poster">
        <img :src="item.poster" :alt="item.title" @click="api.play(item)">
      </header>
      <dl @click="api.play(item)" :class="{'no-poster': !item.poster}">
        <dt :title="item.title">{{ item.title }}</dt>
        <dd>
          <time>{{ formatTime(item.duration) }}</time>
          <div>
            <author :author="item.author"/>
            <button @click.stop="api.removePlaylistItem(item)"><span>&times;</span></button>
          </div>
        </dd>
      </dl>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import {inject, ref, watch} from "vue";
import Author from "./Author.vue";
import {GsPlayerInjectKey, IGsPlayerInject} from "../type/IGsPlayerInject";
import {formatTime} from "../../util";
import {wait} from "gs-base/timer";


const api = inject<IGsPlayerInject>(GsPlayerInjectKey)!;
const playlistRef = ref<HTMLElement>();

// 当激活状态改变时，滚动到激活的条目
watch(() => api.src?._id, () => {
  scrollToActiveItem();
});

// 当播放列表改变时，滚动到激活的条目
watch(() => api.playlist.length, () => {
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
