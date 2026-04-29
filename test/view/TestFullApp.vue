<template>
  <div class="TestFullApp">
    <gs-player
        ref="playerRef"
        :playlist="videoList"
        @src-change="eventChange('src-change',$event)"
        :keyboard-target="tar"
    >
    </gs-player>
    <button @click="switchToNextSrc">switchToNextSrc</button>
    <hr/>
    volume: {{ playerRef?.core?.volume }}<br/>
    muted: {{ playerRef?.core?.muted }}<br/>
    playing: {{ playerRef?.core?.playing }}<br/>
    time: {{ playerRef?.core?.time }}<br/>
    duration: {{ playerRef?.core?.duration }}<br/>
    rate: {{ playerRef?.core?.rate }}<br/>
    index: {{ playerRef?.core?.index }}<br/>
    list: {{ playerRef?.core?.playlist?.length }}<br/>
    src: {{ playerRef?.core?.src}}<br/>
  </div>
</template>

<script lang="ts" setup>
// import '../../src/player/style/main.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer, IGsPlayerExpose, IStringSource} from "../../src";

const playerRef = ref<IGsPlayerExpose>()

const tar = document

const videoList: IStringSource[] = videos as any;
// const videoList: IStringPlayerSource[] = [videos[0]];

const oSrc = 'http://172.15.0.1/f:/e%E8%A7%86%E9%A2%91%E6%A1%8C%E9%9D%A2/%E7%9F%AD%E8%A7%86%E9%A2%91/%E5%BF%AB%E6%89%8B%E9%80%89%E5%8F%96/%E5%BF%83%E5%87%89%E6%80%8E%E6%9A%969394/%E5%A9%B7%E5%AE%9D%20%E8%AF%B7%E4%BD%A0%E8%AE%A4%E7%9C%9F%E7%9A%84%E5%90%AC%E6%88%91%E8%AF%B4-xiaoxiaoyanziya999.mp4'


function eventChange(name: string, data: any) {
  console.log(name, data)
}

function switchToNextSrc() {
  // playerRef.value.setVolume(.1)
}

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
