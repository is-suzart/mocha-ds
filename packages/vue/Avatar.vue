<template>
  <div class="avatar" :data-size="size" :aria-label="alt || fallback || 'Avatar'">
    <img v-if="src && !imgError" :src="src" :alt="alt" @error="imgError = true" />
    <span v-else class="avatar-fallback">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const imgError = ref(false);

const initials = computed(() => {
  if (!props.fallback) return '?';
  if (props.fallback.length <= 2) return props.fallback;
  return props.fallback
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});
</script>
