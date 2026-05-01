<template>
  <div
      class="gs-list-container"
      :class="[
        `visibility-${visibility}`,
        `layout-${layout}`
      ]"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
  >
    <div class="gs-list-container-wrapper">
      <div v-if="showHeader" class="gs-list-header">
        <div class="gs-list-tabs">
          <button
              v-for="(tab, index) in tabs"
              :key="index"
              class="gs-list-tab"
              :class="{ active: activeTabIndex === index }"
              @click="activeTabIndex = index"
          >
            {{ tab.title }}
          </button>
        </div>
        <button class="gs-list-pin" @click="togglePin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4"/>
            <path d="M12 18v4"/>
            <path d="M4.93 4.93l2.83 2.83"/>
            <path d="M16.24 16.24l2.83 2.83"/>
            <path d="M2 12h4"/>
            <path d="M18 12h4"/>
            <path d="M6.76 17.24l-2.83-2.83"/>
            <path d="M19.07 7.07l-2.83-2.83"/>
          </svg>
        </button>
      </div>

      <div class="gs-list-body">
        <component
            v-for="(tab, index) in tabs"
            :key="index"
            :is="getTabBodyComponent(tab)"
            :core="props.core"
            :cxt="props.cxt"
            :props="props.props"
            :class="{ 'gs-list-tab-body': true, active: activeTabIndex === index }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {IGsWidgetProps, IGsWidget} from '../../type';
import {IListContainerTab, PlaylistItemPart} from '../../type';
import GsPlaylist from './GsPlaylist.vue';

const props = defineProps<IGsWidgetProps>();

const activeTabIndex = ref(0);
const isPinned = ref(false);
const isHovering = ref(false);

const visibility = computed(() => {
  return props.cxt.listContainerVisibility;
});

const layout = computed(() => {
  return props.cxt.layout;
});

const showHeader = computed(() => {
  const headerVisible = props.props.listContainer?.headerVisible;
  if (headerVisible === 'visible') return true;
  if (headerVisible === 'hidden') return false;
  if (layout.value === 'horizontal') return true;
  return tabs.value.length > 1;
});

const tabs = computed<IListContainerTab[]>(() => {
  const defaultTab: IListContainerTab = {
    title: props.cxt.i18n.playlist || 'Playlist',
    body: ['author', '-', 'time'] as PlaylistItemPart[]
  };

  const customTabs = props.props.listContainer?.tabs || [];
  const appendTabs = props.props.listContainer?.appendTabs || [];

  const allTabs = [...customTabs.length ? customTabs : [defaultTab]];

  appendTabs.forEach(tab => {
    const position = Math.min(Math.max(tab.position, 0), allTabs.length);
    allTabs.splice(position, 0, tab);
  });

  return allTabs;
});

function getTabBodyComponent(tab: IListContainerTab): IGsWidget {
  if ('body' in tab && typeof tab.body === 'object' && tab.body !== null) {
    if (Array.isArray(tab.body)) {
      return GsPlaylist;
    }
    return tab.body as IGsWidget;
  }
  return GsPlaylist;
}

function togglePin() {
  isPinned.value = !isPinned.value;
}

function handleMouseEnter() {
  isHovering.value = true;
}

function handleMouseLeave() {
  isHovering.value = false;
}
</script>
