<template>
  <li
      :class="['gs-playlist-item',{ active: current._id === core.src?._id }]"
      @click="core?.play(current)"
      ref="itemRef"
      :style="{top: index * 54 + 'px'}"
  >
    <div class="gs-playlist-item-thumb">
      <img
          class="gs-playlist-item-poster"
          alt="poster"
          loading="lazy"
          v-if="current.thumbnail || current.poster"
          :src="current.thumbnail || current.poster"
      />
      <component :is="PlayStateIcons[(current._id !== core.src?._id).toString()]"/>
    </div>
    <div class="gs-playlist-item-info">
      <div class="gs-playlist-item-title">{{ current.title }}</div>
      <div class="gs-playlist-item-parts">
        <template v-for="(part, index) in parts" :key="index">
          <component
              :is="getPartComponent(part)"
              :current="current"
              :core="core"
              :cxt="cxt"
              :props="widgetProps"
          />
        </template>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import {computed, defineComponent, h, ref} from 'vue';
import {IPlaylistItemProps, PlaylistItemPart, PlaylistItemPartNames} from '../../../type';
import {GsAuthor, GsDate, GsSpacer} from '../../../component';
import {PlayStateIcons} from '../../../svgs';
import {wrapComponent} from '../../../util';


const itemRef = ref<HTMLLIElement>();
const props = defineProps<IPlaylistItemProps>();
const {core, cxt, current} = props;

const widgetProps = computed(() => props.props);

defineOptions({inheritAttrs: false});

const parts = computed<PlaylistItemPart[]>(() => {
  const listContainer = props.props.listContainer;
  const tabs = listContainer?.tabs || [];
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    if (Array.isArray(activeTab.body)) {
      return activeTab.body;
    }
  }
  return PlaylistItemPartNames as any;
});

function getPartComponent(part: PlaylistItemPart) {
  if (typeof part === 'string') {
    switch (part) {
      case '-':
        return GsSpacer
      case 'author':
        return wrapComponent(GsAuthor, {
          author: current.author,
          handleClick: false
        });
      case 'date':
        if (!current.createdAt) return null;
        return wrapComponent(GsDate, {
          date: current.createdAt,
          i18n: cxt.i18n.date,
          showFullOnHover: false
        });
      case 'time':
        return defineComponent({
          inheritAttrs: false,
          render: () => {
            const duration = current.duration;
            if (!duration) return null;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            return h('span', {class: 'gs-playlist-item-text'}, `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          }
        } as any);
      case 'remove':
        return defineComponent({
          inheritAttrs: false,
          render: () => {
            return h('button', {
              class: 'gs-playlist-item-remove',
              onClick: (e: Event) => {
                e.stopPropagation();
                core.removeSrc(current);
              },
              title: cxt.i18n.remove
            }, h('span', '\u00D7'));
          }
        } as any);
      default:
        return null;
    }
  }
  return part;
}
</script>
