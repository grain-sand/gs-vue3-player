<template>
  <figure
      v-if="author"
      class="gs-author"
      :class="{ 'gs-author-clickable': handleClick && author.link }"
      @click="handleClickFn"
  >
    <div class="gs-author-avatar">
      <img v-if="author.profileImage" :src="author.profileImage" :alt="author.name">
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      </svg>
    </div>
    <figcaption class="gs-author-name">{{ author.name }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import {IAuthorProps} from '../type';

defineOptions({inheritAttrs: false});

const props = withDefaults(defineProps<IAuthorProps>(), {
  handleClick: true
});

function handleClickFn() {
  if (props.handleClick && props.author?.link) {
    const handler = props.linkHandler || window.open;
    handler(props.author.link);
  }
}
</script>
