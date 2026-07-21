<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isSelected"
    :aria-controls="`tabpanel-${value}`"
    :id="`tabtrigger-${value}`"
    :data-value="value"
    :tabindex="isSelected ? 0 : -1"
    :disabled="disabled"
    class="tabs-trigger"
    :data-variant="tabs.variant.value"
    :data-size="tabs.size.value"
    :data-state="isSelected ? 'active' : undefined"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';

const props = withDefaults(defineProps<{
  value: string;
  disabled?: boolean;
  to?: string;
}>(), {
  disabled: false,
  to: '',
});

const tabs = inject<any>('tabs');
const route = useRoute();

const isSelected = computed(() => {
  if (tabs.mode.value === 'router' && props.to) {
    return route.path === props.to || route.path.startsWith(props.to);
  }
  return tabs.activeValue.value === props.value;
});

function handleClick() {
  if (props.disabled) return;

  if (tabs.mode.value === 'router' && props.to) {
    tabs.navigateTo(props.to);
  } else {
    tabs.selectTab(props.value);
  }
}
</script>
