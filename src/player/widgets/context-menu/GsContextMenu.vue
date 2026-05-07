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
        <GsContextMenuItem
            v-else-if="item === 'info' || item === 'list'"
            :item="item"
            :i18n="cxt.i18n"
            @action="handleMenuItemAction"
        />
        <component
            v-else-if="typeof item !== 'string'"
            :is="item"
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
import {ContextMenuItemDefaultNames, IGsWidgetProps} from '../../../type';
import GsContextMenuItem from './GsContextMenuItem.vue';

const props = defineProps<IGsWidgetProps>();

const isVisible = ref(false);
const menuPosition = ref({x: 0, y: 0});
const pageRoot = computed(() => props.props.pageRoot ?? document.body);

const cxt = computed(() => props.cxt);

const menuStyle = computed(() => ({
  left: `${menuPosition.value.x}px`,
  top: `${menuPosition.value.y}px`
}));

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

const handleMenuItemAction = (item: string) => {
  switch (item) {
    case 'info':
      cxt.value.infoPanelVisible = !cxt.value.infoPanelVisible;
      break;
    case 'list':
      cxt.value.toggleListVisibility();
      break;
  }
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
