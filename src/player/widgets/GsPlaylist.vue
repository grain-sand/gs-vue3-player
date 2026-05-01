<template>
  <div class="gs-playlist" @click.stop>
    <ul class="gs-playlist-items">
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
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import GsPlaylistItem from './GsPlaylistItem.vue';

defineProps<IGsWidgetProps>();
</script>
