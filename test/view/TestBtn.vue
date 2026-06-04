<template>
  <button class="TestBtn" @click="props.setActive()">
    TestBtn
  </button>
</template>

<script lang="ts" setup>
import {defineOptions} from 'vue'
import {IListTabHeaderPartProps} from "../../src";

defineOptions({inheritAttrs: false});

const props = defineProps<IListTabHeaderPartProps>()
console.log(props)
</script>
