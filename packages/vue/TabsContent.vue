<template>
  <div
    role="tabpanel"
    :id="`tabpanel-${value}`"
    :aria-labelledby="`tabtrigger-${value}`"
    tabindex="0"
    class="tabs-content"
    :data-state="isActive ? 'active' : undefined"
    :style="{ display: isActive ? '' : 'none' }"
  >
    <template v-if="isActive">
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  value: string;
}>();

const tabs = inject<any>('tabs');
const route = useRoute();

const isActive = computed(() => {
  if (tabs.mode.value === 'router') {
    return route.path === props.value || route.path.startsWith(props.value);
  }
  return tabs.activeValue.value === props.value;
});
</script>
