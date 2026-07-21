<template>
  <div
    style="position:relative;display:inline-flex"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocus"
    @focusout="onBlur"
  >
    <slot />
    <Teleport to="body" v-if="isVisible">
      <div
        :class="tooltipClass"
        style="position:fixed;z-index:1100"
        role="tooltip"
      >
        <div class="tooltip-content">{{ content }}</div>
        <div class="tooltip-arrow"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  content: string;
  placement?: TooltipPlacement;
  color?: string;
  delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top',
  color: 'dark',
  delay: 200,
});

const isVisible = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const tooltipClass = computed(() => {
  const colorClass = props.color === 'dark' || props.color === 'light'
    ? `tooltip--preset-${props.color}`
    : `tooltip--${props.color}`;
  return [
    'tooltip',
    `tooltip--placement-${props.placement}`,
    colorClass,
  ];
});

function onMouseEnter() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => { isVisible.value = true; }, props.delay);
}

function onMouseLeave() {
  if (timeoutId) clearTimeout(timeoutId);
  isVisible.value = false;
}

function onFocus() {
  if (timeoutId) clearTimeout(timeoutId);
  isVisible.value = true;
}

function onBlur() {
  if (timeoutId) clearTimeout(timeoutId);
  isVisible.value = false;
}
</script>
