<template>
  <div
      class="gs-list-container"
      :class="[
        `visibility-${cxt.listVisibility}`,
        `layout-${cxt.layout}`
      ]"
      @click.stop.prevent=""
      @wheel.stop=''
      @dblclick.stop.prevent=""
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
        <button class="gs-list-pin" @click="cxt.toggleListVisibility()">
          <PinSvg/>
        </button>
      </div>

      <component
          v-if="activeTab"
          :is="getTabBodyComponent(activeTab)"
          :core="core"
          :cxt="cxt"
          :props="props"
          class="gs-list-tab-body active"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {IGsWidgetProps, IGsWidget} from '../../type';
import {IListContainerTab, PlaylistItemPart} from '../../type';
import GsPlaylist from './GsPlaylist.vue';
import {PinSvg} from '../../svgs';

const {props, core, cxt} = defineProps<IGsWidgetProps>();

const activeTabIndex = ref(0);

const showHeader = computed(() => {
  const headerVisible = props.listContainer?.headerVisible;
  if (headerVisible === 'visible') return true;
  if (headerVisible === 'hidden') return false;
  if (cxt.layout === 'horizontal') return true;
  return tabs.value.length > 1;
});

const tabs = computed<IListContainerTab[]>(() => {
  const defaultTab: IListContainerTab = {
    title: cxt.i18n.playlist || 'Playlist',
    body: ['author', '-', 'time'] as PlaylistItemPart[]
  };

  const customTabs = props.listContainer?.tabs || [];
  const appendTabs = props.listContainer?.appendTabs || [];

  const allTabs = [...customTabs.length ? customTabs : [defaultTab]];

  appendTabs.forEach(tab => {
    const position = Math.min(Math.max(tab.position, 0), allTabs.length);
    allTabs.splice(position, 0, tab);
  });

  return allTabs;
});

const activeTab = computed(() => tabs.value[activeTabIndex.value]);

const getTabBodyComponent = (tab: IListContainerTab): IGsWidget => {
  if ('body' in tab && typeof tab.body === 'object' && tab.body !== null) {
    if (Array.isArray(tab.body)) return GsPlaylist;
    return tab.body as IGsWidget;
  }
  return GsPlaylist;
};

</script>
