<template>
  <Overlay
    :is-open="isOpen"
    :close-on-overlay-click="closeOnOverlayClick"
    :close-on-esc="closeOnEsc"
    @close="emit('close')"
  >
    <div
      class="modal" :data-size="size"
      role="dialog"
      aria-modal="true"
    >
      <div v-if="title || showCloseButton || $slots.header" class="modal-header">
        <slot name="header">
          <h2 class="modal-title">{{ title }}</h2>
        </slot>
        <button
          v-if="showCloseButton"
          class="modal-close-btn"
          @click="emit('close')"
          aria-label="Close modal"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <slot />
      </div>

      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </Overlay>
</template>

<script setup lang="ts">
import Overlay from './Overlay.vue';

type ModalSize = 'sm' | 'md' | 'lg';

interface Props {
  isOpen: boolean;
  title?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  size: 'md',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  showCloseButton: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
