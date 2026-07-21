<template>
  <nav :class="containerClass" aria-label="Pagination">
    <button
      class="pagination-item"
      :class="`pagination-item--${size}`"
      :disabled="modelValue <= 1"
      @click="goTo(modelValue - 1)"
      aria-label="Previous page"
    >
      &lsaquo;
    </button>

    <template v-for="(item, idx) in range" :key="idx">
      <span v-if="item === DOTS" class="pagination-ellipsis">{{ DOTS }}</span>
      <button
        v-else
        class="pagination-item"
        :class="[
          `pagination-item--${size}`,
          { 'pagination-item--active': item === modelValue }
        ]"
        @click="goTo(item as number)"
        :aria-current="item === modelValue ? 'page' : undefined"
      >
        {{ item }}
      </button>
    </template>

    <button
      class="pagination-item"
      :class="`pagination-item--${size}`"
      :disabled="modelValue >= totalPages"
      @click="goTo(modelValue + 1)"
      aria-label="Next page"
    >
      &rsaquo;
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type PaginationSize = 'sm' | 'md' | 'lg';
type PaginationShape = 'square' | 'rounded' | 'pill';
type PaginationColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

const DOTS = '...';

interface Props {
  modelValue?: number;
  totalPages: number;
  siblingCount?: number;
  size?: PaginationSize;
  shape?: PaginationShape;
  color?: PaginationColor;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  totalPages: 1,
  siblingCount: 1,
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const range = computed(() => getRange(props.modelValue, props.totalPages, props.siblingCount));

const containerClass = computed(() => {
  return [
    'pagination',
    `pagination--${props.size}`,
    `pagination--${props.shape}`,
    `pagination--${props.color}`,
  ];
});

function getRange(current: number, total: number, siblings: number): (number | string)[] {
  const totalPageNumbers = siblings * 2 + 5;
  if (totalPageNumbers >= total) {
    return Array.from({ length: Math.max(total, 1) }, (_, i) => i + 1);
  }
  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 2;
  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblings;
    return [...Array.from({ length: leftCount }, (_, i) => i + 1), DOTS, total];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblings;
    return [1, DOTS, ...Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1)];
  }
  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
  return [1, DOTS, ...middleRange, DOTS, total];
}

function goTo(page: number) {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return;
  emit('update:modelValue', page);
}
</script>
