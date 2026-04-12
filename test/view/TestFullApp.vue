<template>
  <div class="TestFullApp">
    <gs-player
        :src="src"
        :next-src="next"
        :pre-src="pre"
        :volume="0.3"
        @srcChange="srcChange"
    />
  </div>
</template>

<script lang="ts" setup>
import '../../src/full/style/index.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer, IStringPlayerSource} from "../../src";
import {copyObject} from "gs-base";

let index = 0;

const videoList: IStringPlayerSource[] = videos.map((item, i) => ({
  ...item,
  data: i
}))


function getUrl() {
  return videoList[(index + 1) % videoList.length]
}

function getPreUrl() {
  return videoList[(index + videoList.length - 1) % videoList.length]
}

const src = ref(videoList[0])
const next = ref(null)
const pre = ref(null)

function srcChange(nextSrc: IStringPlayerSource<number>) {
  index = nextSrc.data;
  console.log(copyObject(nextSrc));
  next.value = getUrl();
  pre.value = getPreUrl();
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
