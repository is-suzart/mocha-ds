<template>
  <div
    role="tablist"
    :aria-orientation="tabs.orientation.value"
    class="tabs-list"
    :data-variant="tabs.variant.value"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

const tabs = inject<any>('tabs');

function handleKeyDown(event: KeyboardEvent) {
  const list = event.currentTarget as HTMLElement;
  const triggers = Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLElement[];
  const activeIndex = triggers.findIndex(el => el.getAttribute('aria-selected') === 'true');

  if (activeIndex === -1) return;

  let nextIndex = activeIndex;
  const isHorizontal = tabs.orientation.value === 'horizontal';

  if (isHorizontal) {
    if (event.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % triggers.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
    }
  } else {
    if (event.key === 'ArrowDown') {
      nextIndex = (activeIndex + 1) % triggers.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
    }
  }

  if (nextIndex !== activeIndex) {
    event.preventDefault();
    const nextTrigger = triggers[nextIndex];
    nextTrigger.focus();
    nextTrigger.click();
  }
}
</script>
