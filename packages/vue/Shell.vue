<template>
  <div :class="shellClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ShellLayout = 'header-first' | 'sidebar-first' | 'simple' | 'custom';

interface Props {
  layout?: ShellLayout;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'header-first',
  fullScreen: true,
});

const shellClass = computed(() => {
  return [
    'shell',
    `shell--${props.layout}`,
    props.fullScreen ? 'shell--full-screen' : '',
  ];
});
</script>
