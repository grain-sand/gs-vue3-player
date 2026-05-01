<template>
  <div class="gs-playlist" @click.stop>
    <ul class="gs-playlist-items">
      <li
          v-for="item in core.playlist"
          :key="item._id"
          class="gs-playlist-item"
          :class="{ active: item._id === core.src._id }"
          @click="core?.play(item)"
      >
        <div class="gs-playlist-item-thumb">
          <img v-if="item.poster" :src="item.poster" class="gs-playlist-item-poster" alt="poster" loading="lazy" />
          <component :is="PlayStateIcons[(item._id !== core.src._id).toString()]"/>
        </div>
        <div class="gs-playlist-item-info">
          <div class="gs-playlist-item-title">{{ item.title }}</div>
          <div v-if="item.author?.name" class="gs-playlist-item-author">
            {{ item.author.name }}
          </div>
        </div>
        <div v-if="item.duration" class="gs-playlist-item-time">
          {{ formatTime(item.duration) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {formatTime} from '../../util';
import {PlayStateIcons} from '../../svgs';

defineProps<IGsWidgetProps>();
</script>
