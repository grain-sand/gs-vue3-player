<template>
  <ul class="gs-playlist" @click.stop>
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
import {IGsWidgetProps} from '../../type';
import GsPlaylistItem from './GsPlaylistItem.vue';

defineProps<IGsWidgetProps>();
</script>
