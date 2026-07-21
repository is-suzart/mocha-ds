<template>
  <Teleport to="body">
    <div
      v-if="shouldRender"
      class="overlay" :data-state="isAnimatedIn ? 'open' : undefined"
      :style="{ zIndex: zIndex }"
      @click="handleOverlayClick"
      role="presentation"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script lang="ts">
// Module-level count of open overlays for z-index stacking
let activeOverlayCount = 0;
</script>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  isOpen: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnOverlayClick: true,
  closeOnEsc: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const shouldRender = ref(props.isOpen);
const isAnimatedIn = ref(false);
const zIndex = ref(1000);
let timeoutId: any = null;

watch(() => props.isOpen, (newVal) => {
  clearTimeout(timeoutId);
  if (newVal) {
    activeOverlayCount++;
    zIndex.value = 1000 + activeOverlayCount;
    shouldRender.value = true;
    document.body.style.overflow = 'hidden';
    timeoutId = setTimeout(() => {
      isAnimatedIn.value = true;
    }, 10);
  } else {
    isAnimatedIn.value = false;
    timeoutId = setTimeout(() => {
      shouldRender.value = false;
      if (activeOverlayCount > 0) {
        activeOverlayCount--;
      }
      if (activeOverlayCount === 0) {
        document.body.style.overflow = '';
      }
    }, 200);
  }
}, { immediate: true });

const handleOverlayClick = (e: MouseEvent) => {
  if (props.closeOnOverlayClick && e.target === e.currentTarget) {
    emit('close');
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen && props.closeOnEsc) {
    if (zIndex.value === 1000 + activeOverlayCount) {
      emit('close');
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  clearTimeout(timeoutId);
  if (props.isOpen) {
    if (activeOverlayCount > 0) {
      activeOverlayCount--;
    }
    if (activeOverlayCount === 0) {
      document.body.style.overflow = '';
    }
  }
});
</script>
