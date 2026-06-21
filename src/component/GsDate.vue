<template>
  <time
      v-if="shortDate"
      class="gs-date"
      :datetime="fullDate"
      :class="{'gs-info-time-hover': timeHover && showFullOnHover}"
      @mouseenter="timeHover = true;showFullOnHover&&(display = fullDate)"
      @mouseleave="timeHover = false"
      :style="{width: `${showFullOnHover && timeHover ? fullWidth : shotWidth}px`}"
      @transitionend="!timeHover && (display = shortDate)"
      :title="showFullOnHover?'':fullDate"
  >
    <DateSvg/>
    <span v-text="formatDate(props.date, {i18n: props.i18n})"></span>
  </time>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {IGsDateDisplayProps} from "../type";
import {DateSvg} from "../svgs";
import {formatDate, measureRenderedText} from "../util";

defineOptions({inheritAttrs: false});

const props = withDefaults(defineProps<IGsDateDisplayProps>(), {
  showFullOnHover: true
});

const display = ref('');

const showFullOnHover = computed(() => props.showFullOnHover);

const timeHover = ref(false);

const shortDate = computed(() => formatDate(props.date, {i18n: props.i18n}));

const fullDate = computed(() => formatDate(props.date, {
  i18n: props.i18n,
  omitYearThisYear: false,
  relativeTimeThreshold: null,
  shortYear: false,
  showTime: true
}));

onMounted(() => display.value = shortDate.value)

const shotWidth = computed(() => measureRenderedText({text: shortDate.value, className: 'gs-date'}).width + 17);
const fullWidth = computed(() => measureRenderedText({text: fullDate.value, className: 'gs-date'}).width + 17);

const style = computed(() => (props.showFullOnHover ? {
  width: `${showFullOnHover.value && timeHover.value ? fullWidth.value : shotWidth.value}px`
} : {}));

</script>
