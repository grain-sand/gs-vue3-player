<template>
  <div class="TestFullApp">
    <gs-player
        width="640"
        :volume="0.3"
        @srcChange="srcChange"
        :playlist="videoList"
        @volumeChange="eventChange('volumeChange',$event)"
        @playbackModeChange="eventChange('playbackModeChange',$event)"
        @playbackRateChange="eventChange('playbackRateChange',$event)"
    >
    </gs-player>
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
  console.log(copyObject(nextSrc));
  // index = nextSrc.data;
  // next.value = getUrl();
  // pre.value = getPreUrl();
}

function eventChange(name:string,value:any) {
  console.log(name,value)
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
