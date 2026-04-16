<template>
  <div class="TestFullApp">
    <gs-player
        ref="playerRef"
        :volume="0.5"
        @srcChange="srcChange($event)"
        :playlist="videoList"
        autoplay
        muted
        @volumeChange="eventChange('volumeChange',$event)"
        @modeChange="eventChange('playbackModeChange',$event)"
        @rate-change="eventChange('ratechange',$event)"
        @mutedChange="eventChange('mutedChange',$event)"
    >
    </gs-player>
    <button @click="switchToNextSrc">switchToNextSrc</button>
    <hr/>
    volume: {{ playerRef?.volume }}<br/>
    muted: {{ playerRef?.muted }}<br/>
    playing: {{ playerRef?.playing }}<br/>
    time: {{ playerRef?.time }}<br/>
    duration: {{ playerRef?.duration }}<br/>
    rate: {{ playerRef?.rate }}<br/>
    index: {{ playerRef?.index }}<br/>
  </div>
</template>

<script lang="ts" setup>
import '../../src/full/style/main.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer, IGsPlayerExpose, IStringPlayerSource} from "../../src";
import {copyObject} from "gs-base";

const playerRef = ref<IGsPlayerExpose>()

const videoList: IStringPlayerSource[] = videos.map((item, i) => ({
  ...item,
  data: i
}))

const oSrc = 'http://172.15.0.1/f:/e%E8%A7%86%E9%A2%91%E6%A1%8C%E9%9D%A2/%E7%9F%AD%E8%A7%86%E9%A2%91/%E5%BF%AB%E6%89%8B%E9%80%89%E5%8F%96/%E5%BF%83%E5%87%89%E6%80%8E%E6%9A%969394/%E5%A9%B7%E5%AE%9D%20%E8%AF%B7%E4%BD%A0%E8%AE%A4%E7%9C%9F%E7%9A%84%E5%90%AC%E6%88%91%E8%AF%B4-xiaoxiaoyanziya999.mp4'

const src = ref(videoList[0])

function srcChange(nextSrc: IStringPlayerSource<number>) {
  console.log(copyObject(nextSrc));
  // index = nextSrc.data;
  // next.value = getUrl();
  // pre.value = getPreUrl();
}

function eventChange(name: string, data: any) {
  console.log(name, data)
}

function switchToNextSrc() {
  // playerRef.value.setVolume(.1)
  playerRef.value.play(videoList[0])
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
