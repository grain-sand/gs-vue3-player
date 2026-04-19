<template>
  <figure
      v-if="author"
      class="gs-author"
      :class="{handleClick: props.author?.link}"
      @click="openFn"
  >
    <img v-if="author.profileImage" :src="author.profileImage" :alt="author.name">
    <figcaption>{{ author?.name }}</figcaption>
  </figure>
</template>

<script lang="ts" setup>
import {IAuthorProps} from "../../type";

const props = defineProps<IAuthorProps>()

function openFn() {
  const link = props.author?.link
  if (link) {
    window.open(link)
  }
}

</script>
