<template>
  <teleport :to="pageRoot">
    <div
        v-if="isVisible"
        class="gs-context-menu"
        :style="menuStyle"
        @click.stop
        @contextmenu.prevent
    >
      <template v-for="(item, index) in resolvedItems" :key="index">
        <div
            v-if="item === '|'"
            class="gs-context-menu-divider"
        />
        <component
            v-else
            :is="resolveComponent(item)"
            :core="props.core"
            :cxt="props.cxt"
            :props="props.props"
        />
      </template>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {ContextMenuItem, ContextMenuItemDefaultNames, IGsWidget, IGsWidgetProps} from '../../../type';
import GsInfoMenuItem from './GsInfoMenuItem.vue';
import GsListMenuItem from './GsListMenuItem.vue';

const props = defineProps<IGsWidgetProps>();

const isVisible = ref(false);
const menuPosition = ref({x: 0, y: 0});
const pageRoot = computed(() => props.props.pageRoot ?? document.body);

const cxt = computed(() => props.cxt);

const menuStyle = computed(() => ({
  left: `${menuPosition.value.x}px`,
  top: `${menuPosition.value.y}px`
}));

const defaultComponents: Record<string, IGsWidget> = {
  'info': GsInfoMenuItem,
  'list': GsListMenuItem
};

const resolvedItems = computed(() => {
  const items = [...ContextMenuItemDefaultNames];

  if (props.props.contextMenu?.items) {
    return props.props.contextMenu.items;
  }

  if (props.props.contextMenu?.insertItems) {
    for (const insert of props.props.contextMenu.insertItems) {
      const pos = insert.position ?? items.length;
      items.splice(pos, 0, insert.item);
    }
  }

  return items;
});

const resolveComponent = (item: ContextMenuItem): IGsWidget => {
  if (typeof item === 'string') {
    return defaultComponents[item] || GsInfoMenuItem;
  }
  return item;
};

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();

  if (props.props.contextMenu === null) return;

  const x = e.clientX;
  const y = e.clientY;

  menuPosition.value = {x, y};
  isVisible.value = true;
};

const handleClickOutside = (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('.gs-context-menu')) return;
  isVisible.value = false;
};

onMounted(() => {
  const videoWrapper = cxt.value.videoWrapper;
  videoWrapper.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  const videoWrapper = cxt.value.videoWrapper;
  videoWrapper.removeEventListener('contextmenu', handleContextMenu);
  document.removeEventListener('click', handleClickOutside);
});

watch(() => props.props.contextMenu, (newVal) => {
  if (newVal === null) {
    isVisible.value = false;
  }
});
</script>
