<template>
  <button
    type="button"
    class="dropdown-item"
    :disabled="disabled"
    role="menuitem"
    :data-color="danger ? 'danger' : color"
    :data-state="disabled ? 'disabled' : undefined"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';

interface Props {
  disabled?: boolean;
  danger?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  danger: false,
});

const color = inject<string>('dropdownColor', 'mauve');
const dropdownClose = inject<() => void>('dropdownClose', () => {});

function handleClick() {
  if (props.disabled) return;
  dropdownClose();
}
</script>
