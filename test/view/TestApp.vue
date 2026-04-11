<template>
  <div class="TestApp">
    <player
        ref="playerRef"
        :src="src"
        :autoplay="false"
        :controls="false"
        width="320"
        height="240"
        @ended="onEnd"
        :volume="0.2"
    />
    <button @click="play">按钮</button>
    <button @click="test">看看</button>
  </div>
</template>

<script lang="ts" setup>
import {IPlayerExpose, Player} from '../../src';
import {ref} from "vue";
import {videos} from "./videos.local";

let index = 0;


function getUrl() {
  return videos[index++ % videos.length]
}

const src = ref(getUrl())

const playerRef = ref<IPlayerExpose>(null) as { value: IPlayerExpose }


async function play() {
  await playerRef.value?.togglePlay();
}

function test() {
  const {el} = playerRef.value
  console.log(el.paused)
}

async function onEnd() {
  await playerRef.value?.play(getUrl());
}

</script>
