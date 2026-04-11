<template>
  <div class="TestFullApp">
    <gs-player
        :src="src"
        :next-src="next"
        :volume="0.3"
        @srcChange="srcChange"
    />
  </div>
</template>

<script lang="ts" setup>
import '../../src/full/style/index.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer, PlayerSource} from "../../src";
import {copyObject} from "gs-base";

let index = 1;


function getUrl() {
  return videos[index++]
}

const src = ref(getUrl())
const next = ref(null)

function srcChange(nextSrc: PlayerSource) {
  console.log(copyObject(nextSrc));
  console.log(videos.length, index)
  next.value = getUrl();
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
