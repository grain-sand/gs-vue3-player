<template>
  <div class="gs-info-panel">
    <div class="gs-info-header">
      <GsAuthor
          v-if="core.src?.author"
          :author="core.src.author"
          :link-handler="props.linkHandler"
          class="gs-info-author"
      />
    </div>
    <div class="gs-info-content">
      <div class="gs-info-title" v-html="core.src?.description || core.src?.title"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {GsAuthor} from "../../component";

defineProps<IGsWidgetProps>();
</script>
