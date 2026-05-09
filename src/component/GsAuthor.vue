<template>
  <figure
      v-if="author"
      class="gs-author"
      :class="{ 'gs-author-clickable': link }"
      @click="link && props.linkHandler?.(link)"
      :title="link"
  >
    <div class="gs-author-avatar">
      <img v-if="author.profileImage" :src="author.profileImage" :alt="author.name">
      <UserSvg v-else/>
    </div>
    <figcaption class="gs-author-name">{{ author.name }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import {IAuthorProps} from '../type';
import {UserSvg} from '../svgs';
import {computed} from "vue";

defineOptions({inheritAttrs: false});

const props = withDefaults(defineProps<IAuthorProps>(), {
  handleClick: true
});

const link = computed(() => props.handleClick && props.linkHandler && props.author?.link);


</script>
