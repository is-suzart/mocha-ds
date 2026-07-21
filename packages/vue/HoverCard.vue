<template>
  <div ref="hcEl" style="display:contents">
    <span
      class="hover-card-trigger"
      ref="triggerEl"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @focusin="onFocus"
      @focusout="onBlur"
    >
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="floatingEl"
        class="hover-card" :data-placement="actualPlacement"
        :style="{ position: 'fixed', top: top + 'px', left: left + 'px', zIndex: 1100 }"
        @mouseenter="onCardEnter"
        @mouseleave="onCardLeave"
      >
        <div class="hover-card-arrow" />
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type HoverCardPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

interface Props {
  placement?: HoverCardPlacement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  offset: 8,
  openDelay: 400,
  closeDelay: 300,
});

const isVisible = ref(false);
const top = ref(0);
const left = ref(0);
const actualPlacement = ref<HoverCardPlacement>('bottom');
const hcEl = ref<HTMLElement>();
const triggerEl = ref<HTMLElement>();
const floatingEl = ref<HTMLElement>();
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function updatePosition() {
  if (!triggerEl.value) return;
  const rect = triggerEl.value.getBoundingClientRect();
  actualPlacement.value = props.placement;
  top.value = rect.bottom + props.offset;
  left.value = rect.left;
}

function onMouseEnter() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    isVisible.value = true;
    updatePosition();
  }, props.openDelay);
}

function onMouseLeave() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    isVisible.value = false;
  }, props.closeDelay);
}

function onFocus() {
  if (timeoutId) clearTimeout(timeoutId);
  isVisible.value = true;
  updatePosition();
}

function onBlur() {
  if (timeoutId) clearTimeout(timeoutId);
  isVisible.value = false;
}

function onCardEnter() {
  if (timeoutId) clearTimeout(timeoutId);
}

function onCardLeave() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    isVisible.value = false;
  }, props.closeDelay);
}
</script>
