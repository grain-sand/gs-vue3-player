<template>
  <figure
      v-if="author"
      class="gs-author"
      :class="{ 'gs-author-clickable': handleClick && author.link }"
      @click="handleClickFn"
  >
    <div class="gs-author-avatar">
      <img v-if="author.profileImage" :src="author.profileImage" :alt="author.name">
      <UserSvg v-else />
    </div>
    <figcaption class="gs-author-name">{{ author.name }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import {IAuthorProps} from '../type';
import {UserSvg} from '../svgs';

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
