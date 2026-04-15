<template>
  <div class="TestFullApp">
    <gs-player
        ref="playerRef"
        width="640"
        :volume="0.5"
        @srcChange="srcChange($event)"
        :playlist="videoList"
        @volumeChange="eventChange('volumeChange',$event)"
        @playbackModeChange="eventChange('playbackModeChange',$event)"
        @playbackRateChange="eventChange('playbackRateChange',$event)"
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


const src = ref(videoList[0])
const next = ref(null)
const pre = ref(null)

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
  playerRef.value.setVolume(.1)
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
