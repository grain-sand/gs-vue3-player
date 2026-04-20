<template>
  <ul class="gs-playlist">
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
import {inject} from "vue";
import Author from "./Author.vue";
import {GsPlayerInjectKey, IGsPlayerInject} from "../type/IGsPlayerInject";
import {formatTime} from "../../util";


const api = inject<IGsPlayerInject>(GsPlayerInjectKey)!;


</script>
