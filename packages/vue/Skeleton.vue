<template>
  <div v-if="count > 1" class="skeleton-group" :style="{ gap }">
    <div
      v-for="i in count"
      :key="i"
      class="skeleton"
      :data-variant="variant"
      :data-size="size"
      :data-full="width ? undefined : 'true'"
      :data-animated="animated ? undefined : 'false'"
      :style="customStyle"
      aria-hidden="true"
    />
  </div>
  <div v-else
    class="skeleton"
    :data-variant="variant"
    :data-size="size"
    :data-full="width ? undefined : 'true'"
    :data-animated="animated ? undefined : 'false'"
    :style="customStyle"
    aria-hidden="true"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type SkeletonVariant = 'text' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  width?: string;
  height?: string;
  animated?: boolean;
  count?: number;
  gap?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'md',
  animated: true,
  count: 1,
  gap: '8px',
});

const classes = computed(() => {
  return 'skeleton';
});

const customStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) style.width = props.width;
  if (props.height) style.height = props.height;
  return style;
});
</script>

<style scoped>
.skeleton-group {
  display: flex;
  flex-direction: column;
}
</style>
