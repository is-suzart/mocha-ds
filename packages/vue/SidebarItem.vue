<template>
  <a class="sidebar-item" :class="{ 'sidebar-item--active': active }">
    <span v-if="icon" class="sidebar-item-icon">{{ icon }}</span>
    <span class="sidebar-item-label"><slot /></span>
  </a>
</template>

<script setup lang="ts">
interface Props {
  active?: boolean;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  active: false,
  icon: '',
});
</script>
