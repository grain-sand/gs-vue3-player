<template>
  <time
      v-if="shortDate"
      class="gs-date"
      :datetime="fullDate"
      :class="{'gs-info-time-hover': timeHover && showFullOnHover}"
      @mouseenter="timeHover = true"
      @mouseleave="timeHover = false"
  >
    <DateSvg/>
    <span v-text="showFullOnHover && timeHover ? fullDate : shortDate"></span>
  </time>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {IGsDateDisplayProps} from "../type";
import {DateSvg} from "../svgs";
import {formatDate} from "../util";

const props = withDefaults(defineProps<IGsDateDisplayProps>(), {
  showFullOnHover: true
});

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
</script>
