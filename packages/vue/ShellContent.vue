<template>
  <div :class="contentClass"><slot /></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  scrollable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  scrollable: false,
});

const contentClass = computed(() => {
  return [
    'shell-content',
    ,
  ];
});
</script>
