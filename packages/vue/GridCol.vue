<template>
  <div :class="colClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type GridColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type GridOffset = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

interface Props {
  span?: GridColSpan;
  offset?: GridOffset;
}

const props = withDefaults(defineProps<Props>(), {
  span: 12,
});

const colClass = computed(() => {
  return [
    'grid-col',
    `grid-col-${props.span}`,
    props.offset ? `grid-col-offset-${props.offset}` : '',
  ];
});
</script>
