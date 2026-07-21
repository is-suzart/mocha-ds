<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
type GridValign = 'start' | 'center' | 'end';

interface Props {
  mobile?: boolean;
  multiline?: boolean;
  gap?: GridGap;
  align?: GridAlign;
  valign?: GridValign;
}

const props = withDefaults(defineProps<Props>(), {
  mobile: false,
  multiline: true,
  gap: 3,
});

const gridClass = computed(() => {
  return [
    'grid',
    props.mobile ? 'grid-mobile' : '',
    props.multiline ? 'grid-multiline' : '',
    `grid-gap-${props.gap}`,
    props.align ? `grid-align-${props.align}` : '',
    props.valign ? `grid-valign-${props.valign}` : '',
  ];
});
</script>
