<template>
  <teleport :to="pageRoot">
    <div
        v-if="isVisible"
        :class="className"
        :style="menuStyle"
        ref="contextMenuRef"
        @contextmenu.prevent
    >
      <template v-for="(item, index) in resolvedItems" :key="index">
        <div
            v-if="item === '|'"
            class="gs-context-menu-divider"
        />
        <component
            v-else-if="resolveContextMenuComponent(item)"
            :is="resolveContextMenuComponent(item)"
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
import {IGsWidgetProps} from '../../../type';
import {
  resolveContextMenuComponent,
  resolveContextMenuItems
} from './contextMenuComponents';

const className = 'gs-context-menu'
const selector = `.${className}`

const props = defineProps<IGsWidgetProps>();

const contextMenuRef = ref<HTMLDivElement>();
const isVisible = ref(false);
const menuPosition = ref({x: 0, y: 0});
const pageRoot = computed(() => props.props.pageRoot ?? document.body);
const cxt = computed(() => props.cxt);

const menuStyle = computed(() => ({
  left: `${menuPosition.value.x}px`,
  top: `${menuPosition.value.y}px`
}));

const resolvedItems = computed(() => {
  const {contextMenu} = props.props;
  return resolveContextMenuItems(
      undefined,
      contextMenu?.items,
      contextMenu?.insertItems
  );
});

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();

  if (props.props.contextMenu === null) return;

  if (isVisible.value) {
    isVisible.value = false;
    return;
  }

  const x = e.clientX;
  const y = e.clientY;

  menuPosition.value = {x, y};
  isVisible.value = true;
};

const handleClickOutside = (e: MouseEvent) => {
  if (isVisible.value === false) {
    return;
  }
  isVisible.value = false;
  if (!(e.target instanceof HTMLElement)) {
    return;
  }
  const el = <HTMLElement>e.target
  if (el === contextMenuRef.value || el.closest(selector) === contextMenuRef.value) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();
}

onMounted(() => {
  const videoWrapper = cxt.value.videoWrapper;
  videoWrapper.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  cxt.value.videoWrapper?.removeEventListener('contextmenu', handleContextMenu);
});

watch(() => props.props.contextMenu, (newVal) => {
  if (newVal === null) {
    isVisible.value = false;
  }
});
</script>
