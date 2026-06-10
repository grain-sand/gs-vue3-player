<template>
  <div class="TestFullApp">
    <gs-player
        ref="playerRef"
        :playlist="videoList"
        @src-changed="eventChange('src-changed',$event)"
        :list-container="{
          appendTabs: playerRef?.layout === 'vertical' ?undefined: [
              {
                title: 'TestBtn',
                body: TestBtn,
                position: 1,
                header:TestBtn
              }
          ]
        }"
        :download-handler="download"
        :link-handler="openLink"
        :socio-word-handler="openLink"
        :default-transform="{scaleMode:'fit'}"
        :always-expand-info-panel="true"
        :info-panel-visible="false"
        list-visibility="hover"
    />
    <hr/>
    <button @click="playerRef.core.play(oSrc)">测试</button>
    <button @click="videoList.push(...copyObject(videos))">添加列表</button>
    <button @click="addManyList()">添加很多列表</button>
    <hr/>
    previousFullscreenRect: {{ playerRef?.previousFullscreenRect }}<br/>
  </div>
</template>

<script lang="ts" setup>
import '../../src/player/style/main.scss'
import {onMounted, ref, watch} from "vue";
import {videos} from "./videos.local";
import {GsPlayer, IGsPlayerExpose} from "../../src";
import TestBtn from './TestBtn.vue'
import {copyObject} from "gs-base";

const playerRef = ref<IGsPlayerExpose>()

const videoList = ref([]);
// const videoList: IStringPlayerSource[] = [videos[0]];

const oSrc = 'http://172.15.0.1/f:/e%E8%A7%86%E9%A2%91%E6%A1%8C%E9%9D%A2/%E7%9F%AD%E8%A7%86%E9%A2%91/%E5%BF%AB%E6%89%8B%E9%80%89%E5%8F%96/%E5%BF%83%E5%87%89%E6%80%8E%E6%9A%969394/%E5%A9%B7%E5%AE%9D%20%E8%AF%B7%E4%BD%A0%E8%AE%A4%E7%9C%9F%E7%9A%84%E5%90%AC%E6%88%91%E8%AF%B4-xiaoxiaoyanziya999.mp4'


function eventChange(name: string, data: any) {
  console.log(name, data)
}

watch(() => playerRef.value?.layout, (layout) => {
  console.log(layout)
})
watch(() => playerRef.value?.isFullscreen, (isFullscreen) => {
  console.log('isFullscreen', isFullscreen)
})

function download(src, props) {
  console.log(src, props)
}

function openLink(url, src, props) {
  console.log(url, src, props)
}

function addManyList() {
  for(let i=0; i<20; i++) {
    videoList.value.push(...copyObject(videos));
  }
}
onMounted(addManyList)
</script>

<style lang="scss">
</style>
