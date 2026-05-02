<template>
  <div class="gs-info-panel"
       @click.stop.prevent=""
       @wheel.stop=''
       @dblclick.stop.prevent=""
  >
    <div class="gs-info-header"
         v-if="core.src?.author">
      <GsAuthor
          :author="core.src.author"
          :link-handler="props.linkHandler"
          class="gs-info-author"
      />
    </div>
    <div
        v-if="cxt.layout === 'vertical'"
        class="gs-info-content"
        :title="title"
        v-html="core.src?.description || core.src?.title?.replace(/\n/g, '<br/>')"
    ></div>
    <div
        v-else
        class="gs-info-content"
        :title="title"
        v-text="title"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {IGsWidgetProps} from '../../type';
import {GsAuthor} from "../../component";
import {computed} from "vue";

const p = defineProps<IGsWidgetProps>();

const title = computed(() => p.core?.src?.description?.replace(/<[^>]+>/g, '') || p.core?.src?.title)
</script>
