<template>
  <aside :class="sidebarClass"><slot /></aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  collapsed?: boolean;
  collapsible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  collapsible: false,
});

const sidebarClass = computed(() => {
  return [
    'sidebar',
    props.collapsed ? 'sidebar--collapsed' : '',
    props.collapsible ? 'sidebar--collapsible' : '',
  ];
});
</script>
