<template>
  <div ref="popoverEl" style="display:contents">
    <span class="popover-trigger" ref="triggerEl" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="floatingEl"
        class="popover" :data-placement="actualPlacement"
        :style="{ position: 'fixed', top: top + 'px', left: left + 'px', zIndex: 1100 }"
      >
        <div class="popover-arrow" />
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

interface Props {
  placement?: PopoverPlacement;
  offset?: number;
  open?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom',
  offset: 8,
});

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void;
}>();

const isOpen = ref(false);
const top = ref(0);
const left = ref(0);
const actualPlacement = ref<PopoverPlacement>('bottom');
const popoverEl = ref<HTMLElement>();
const triggerEl = ref<HTMLElement>();
const floatingEl = ref<HTMLElement>();

function toggle() {
  isOpen.value = !isOpen.value;
  emit('update:open', isOpen.value);
  if (isOpen.value) updatePosition();
}

function updatePosition() {
  if (!triggerEl.value) return;
  const rect = triggerEl.value.getBoundingClientRect();
  actualPlacement.value = props.placement;
  top.value = rect.bottom + props.offset;
  left.value = rect.left;
}

function onClickOutside(e: MouseEvent) {
  if (!isOpen.value) return;
  const target = e.target as Node;
  if (popoverEl.value && !popoverEl.value.contains(target)) {
    isOpen.value = false;
    emit('update:open', false);
  }
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
    emit('update:open', false);
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside);
  document.addEventListener('keydown', onEscape);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside);
  document.removeEventListener('keydown', onEscape);
});
</script>
