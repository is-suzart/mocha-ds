<template>
  <Overlay
    :is-open="isOpen"
    :close-on-overlay-click="closeOnOverlayClick"
    :close-on-esc="closeOnEsc"
    :data-placement="`drawer-${position}`"
    @close="emit('close')"
  >
    <div
      class="drawer"
      :data-placement="position"
      :data-size="size"
      :data-color="color"
      role="dialog"
      aria-modal="true"
    >
      <div v-if="title || showCloseButton" class="drawer-header">
        <div class="drawer-title">{{ title }}</div>
        <button
          v-if="showCloseButton"
          class="drawer-close-btn"
          @click="emit('close')"
          aria-label="Close drawer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="drawer-body">
        <slot />
      </div>
      <div v-if="$slots.footer" class="drawer-footer">
        <slot name="footer" />
      </div>
    </div>
  </Overlay>
</template>

<script setup lang="ts">
import Overlay from './Overlay.vue';

type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
type DrawerColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  isOpen: boolean;
  position?: DrawerPosition;
  size?: DrawerSize;
  color?: DrawerColor;
  title?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  position: 'right',
  size: 'md',
  color: 'mauve',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  showCloseButton: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
