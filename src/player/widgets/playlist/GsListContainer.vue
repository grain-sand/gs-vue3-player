<template>
  <div
      :class="['gs-list-container', {'show-header':showHeader}]"
      @click.stop.prevent=""
      @wheel.stop=''
      @dblclick.stop.prevent=""
  >
    <div class="gs-list-container-wrapper">
      <div v-if="showHeader" class="gs-list-header">
        <div class="gs-list-tabs">
          <template v-for="(tab, index) in tabs" :key="index">
            <div
                class="gs-list-tab-wrapper"
                :class="{ active: activeTabIndex === index }"
            >
              <component
                  v-for="(part, partIndex) in getTabHeaderParts(tab)"
                  :key="partIndex"
                  :is="getHeaderPartComponent(part)"
                  :tab="tab"
                  :active="activeTabIndex === index"
                  :setActive="() => activeTabIndex = index"
                  :core="core"
                  :cxt="cxt"
                  :props="props"
              />
            </div>
          </template>
        </div>
        <template v-if="activeTab && appendButtons?.length" v-for="btn of appendButtons">
          <component
              :is="btn"
              :core="core"
              :cxt="cxt"
              :props="props"
          />
        </template>
        <button class="gs-list-btn" @click="cxt.toggleListVisibility()">
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
import {
  DefaultListHeaderVisible,
  DefaultListTabHeaderPartNames,
  IGsWidget,
  IGsWidgetProps,
  IListContainerTab,
  IListTabHeaderPart,
  ListTabHeaderPart,
  PlaylistItemPart
} from '../../../type';
import GsPlaylist from './GsPlaylist.vue';
import GsListHeaderTab from './GsListHeaderTab.vue';
import {PinSvg} from '../../../svgs';

const {props, core, cxt} = defineProps<IGsWidgetProps>();

const activeTabIndex = ref(0);

const showHeader = computed(() => {
  const headerVisible = props.listContainer?.headerVisible || DefaultListHeaderVisible;
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
    const position = Math.min(Math.max(tab.position ?? allTabs.length, 0), allTabs.length);
    allTabs.splice(position, 0, tab);
  });

  return allTabs;
});

const appendButtons = computed(() => (props.listContainer?.appendButtons || []).reverse());

const activeTab = computed(() => tabs.value[activeTabIndex.value]);

const getTabBodyComponent = (tab: IListContainerTab): IGsWidget => {
  if ('body' in tab && typeof tab.body === 'object' && tab.body !== null) {
    if (Array.isArray(tab.body)) return GsPlaylist;
    return tab.body as IGsWidget;
  }
  return GsPlaylist;
};

const getTabHeaderParts = (tab: IListContainerTab): ListTabHeaderPart[] => {
  if (!tab.header) return [...DefaultListTabHeaderPartNames];
  if (Array.isArray(tab.header)) return tab.header;
  return [tab.header as IListTabHeaderPart];
};

const getHeaderPartComponent = (part: ListTabHeaderPart): IGsWidget => {
  if (typeof part === 'string') {
    switch (part) {
      case 'title':
      default:
        return GsListHeaderTab;
    }
  }
  return part as IGsWidget;
};

</script>
