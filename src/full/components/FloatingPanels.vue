<template>
  <div class="gs-title-float-panel" ref="titlePanel"></div>
  <div class="gs-right-float-panel" ref="rightPanel"></div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {IFloatingPanelsExpose} from "../type/ControlsExposes";

const titlePanel = ref<HTMLDivElement>()
const rightPanel = ref<HTMLDivElement>()


defineExpose<IFloatingPanelsExpose>({
  titlePanel,
  rightPanel
})
</script>
