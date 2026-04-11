<template>
  <div class="TestFullApp">
    <gs-player :src="src"
               :volume="0.3"/>
  </div>
</template>

<script lang="ts" setup>
import '../../src/full/style/index.scss'
import {ref} from "vue";
import {videos} from "./videos.local";
import {GsPlayer} from "../../src";

let index = 1;


function getUrl() {
  return videos[index++ % videos.length]
}

const src = ref(getUrl())

</script>

<style lang="scss">
html {
  .TestFullApp {
    padding-top: 20%;
  }
}
</style>
