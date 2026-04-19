<template>
  <div class="gs-info-panel">
    <section v-text="src?.title"></section>
    <footer v-if="src?.author || src?.link">
      <author :author="src.author" :handle-click="true"/>
      <a v-if="src.link" :href="src.link" target="_blank">
        <link-svg/>
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject} from "vue";
import Author from "./Author.vue";
import {LinkSvg} from "../../svgs";
import {GsPlayerInjectKey, IGsPlayerInject} from "../type/IGsPlayerInject";
import {IGsSource} from "../../type";

const data = inject<IGsPlayerInject>(GsPlayerInjectKey)!;
const src = computed(() => data.playerRef.value?.src as IGsSource);

</script>
