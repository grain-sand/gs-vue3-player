<template>
  <a
      v-if="author"
      :class="['gs-author', { 'gs-author-clickable': link && props.pageUrl !== link }]"
      @click="handleClick"
      :title="link && props.pageUrl !== link ?link:''"
      target="_blank"
      :href="link && props.pageUrl !== link ?link:''"
  >
    <div class="gs-author-avatar">
      <img v-if="author.profileImage" :src="author.profileImage" :alt="author.name">
      <UserSvg v-else/>
    </div>
    <div class="gs-author-name">
      <span class="gs-author-text">{{ author.name }}</span>
      <span v-if="typeIcon.src||typeIcon.svg" :class="['gs-author-icon', authorTypeClass]">
        <img v-if="typeIcon.src" :src="typeIcon.src" alt="verified">
        <component v-else :is="typeIcon.svg"/>
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import {IAuthorProps} from '../type';
import {UserSvg, AuthorTypeIcons} from '../svgs';
import {computed, DefineComponent} from "vue";

defineOptions({inheritAttrs: false});

const props = withDefaults(defineProps<IAuthorProps>(), {
  handleClick: true,
  pageUrl: location.href,
});

const link = computed(() => props.handleClick && props.linkHandler && props.author?.link);

const typeIcon = computed<{ svg?: DefineComponent | null, src?: string }>(() => {
  const type = props.author?.type;
  if (!type) return {};
  if (type in AuthorTypeIcons) {
    return {svg: AuthorTypeIcons[type as keyof typeof AuthorTypeIcons]};
  }
  return {src: type as string};
});

const authorTypeClass = computed(() => {
  if (typeIcon.value.svg) {
    return `type-${props.author?.type}`;
  }
  return `type-none`;
});

function handleClick(e: MouseEvent | TouchEvent) {
  if (!props.handleClick) {
    e.preventDefault();
  } else {
    // noinspection JSIncompatibleTypesComparison
    if (link && props.pageUrl !== link) {
      props.linkHandler?.(link.value, e as any);
    }
  }
}
</script>
