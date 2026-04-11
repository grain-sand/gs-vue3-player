<template>
  <div class="TestFullApp.vue">
    <gs-player :src="src" />
  </div>
</template>

<script lang="ts" setup>
import '../../src/full/style/index.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer} from "../../src";

let index = 0;


function getUrl() {
  return videos[index++ % videos.length]
}

const src = ref(getUrl())

</script>
