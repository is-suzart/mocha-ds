<template>
  <div class="avatar-group" :data-size="size">
    <slot />
    <span v-if="remaining > 0" class="avatar-group-more" :style="moreStyle">
      +{{ remaining }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  size?: AvatarSize;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const slots = useSlots();
const total = computed(() => slots.default?.().length || 0);
const remaining = computed(() => props.max ? Math.max(0, total.value - props.max) : 0);

const moreStyle = computed(() => {
  const px = props.size === 'sm' ? '28px' : props.size === 'lg' ? '48px' : '36px';
  return { width: px, height: px };
});
</script>
