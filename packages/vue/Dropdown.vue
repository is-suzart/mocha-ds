<template>
  <div class="dropdown-wrapper" style="position:relative;display:inline-block">
    <div ref="triggerRef" @click="toggle">
      <slot name="trigger" />
    </div>
    <Teleport to="body" v-if="isOpen">
      <div
        ref="menuRef"
        class="dropdown-menu"
        style="position:fixed;z-index:1050"
        role="menu"
        @click.stop
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, provide } from 'vue';

type DropdownColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  isOpen?: boolean;
  color?: DropdownColor;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  color: 'mauve',
});

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const toggle = () => {
  emit('update:isOpen', !props.isOpen);
};

const close = () => {
  emit('update:isOpen', false);
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node;
  if (
    triggerRef.value && !triggerRef.value.contains(target) &&
    menuRef.value && !menuRef.value.contains(target)
  ) {
    close();
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

watch(() => props.isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    // Position menu near trigger
    if (triggerRef.value && menuRef.value) {
      const rect = triggerRef.value.getBoundingClientRect();
      menuRef.value.style.top = `${rect.bottom + 4}px`;
      menuRef.value.style.left = `${rect.left}px`;
    }
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleKeyDown);
  }
});

provide('dropdownColor', props.color);
provide('dropdownClose', close);
</script>
