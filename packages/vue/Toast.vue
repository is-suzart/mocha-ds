<template>
  <div
    v-for="(group, pos) in grouped"
    :key="pos"
    :class="['toast-container', `toast-container--${pos}`]"
  >
    <div
      v-for="item in group"
      :key="item.id"
      :class="['toast', `toast--${item.variant}`, item.filled ? 'toast--filled' : '', item.color ? `toast--color-${item.color}` : '', { 'toast--exiting': item.exiting }, item.className || '']"
      :style="item.style"
      role="alert"
      aria-live="assertive"
    >
      <div class="toast-icon">
        <svg v-if="item.variant === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <svg v-else-if="item.variant === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg v-else-if="item.variant === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </div>
      <div class="toast-content">
        <div v-if="item.title" class="toast-title">{{ item.title }}</div>
        <div v-if="item.description" class="toast-description">{{ item.description }}</div>
      </div>
      <button class="toast-close" @click="dismiss(item.id)" aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div v-if="item.duration > 0" class="toast-progress" :style="{ animationDuration: item.duration + 'ms' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, onMounted, onUnmounted, ref } from 'vue';
import { registerToastListener, TOAST_STATE_KEY, type ToastItem, type ToastPosition, type ToastColor, type ToastOptions } from './toast';

interface Props {
  position?: ToastPosition;
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom-right',
});

const defaultOpts: Required<Omit<ToastOptions, 'id'>> = {
  title: '',
  description: '',
  variant: 'info',
  duration: 4000,
  position: 'bottom-right',
  filled: false,
  color: '' as ToastColor,
  className: '',
  style: {},
};

const toasts = ref<ToastItem[]>([]);

function addToast(opts: ToastOptions & { id: string }): string {
  const item: ToastItem = {
    ...defaultOpts,
    ...opts,
    position: opts.position || props.position,
    id: opts.id,
    createdAt: Date.now(),
    exiting: false,
  };
  toasts.value = [...toasts.value, item];

  if (item.duration > 0) {
    setTimeout(() => dismiss(item.id), item.duration);
  }

  return item.id;
}

function dismiss(id: string): void {
  toasts.value = toasts.value.map(t => t.id === id ? { ...t, exiting: true } : t);
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 200);
}

const grouped = computed(() => {
  const groups: Record<string, ToastItem[]> = {};
  for (const t of toasts.value) {
    if (!groups[t.position]) groups[t.position] = [];
    groups[t.position].push(t);
  }
  return groups;
});

provide(TOAST_STATE_KEY, { toasts, show: addToast, dismiss });

let unregister: (() => void) | undefined;

onMounted(() => {
  unregister = registerToastListener(addToast);
});

onUnmounted(() => {
  unregister?.();
});
</script>
