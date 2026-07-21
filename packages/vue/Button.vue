<template>
  <button
    ref="buttonEl"
    :class="buttonClass"
    :disabled="disabled || groupDisabled || isLoading"
    :role="groupSelectionMode === 'single' ? 'radio' : undefined"
    :aria-checked="groupSelectionMode === 'single' ? isActive : undefined"
    :tabindex="groupSelectionMode === 'single' ? (isActive ? 0 : -1) : 0"
    :data-variant="variant"
    :data-color="color"
    :data-size="size"
    :data-shape="shape"
    :data-state="isLoading ? 'loading' : (isActive ? 'active' : undefined)"
    @click="handleClick"
    v-bind="$attrs"
  >
    <span class="btn-content">
      <span v-if="isLoading" class="btn-spinner" aria-hidden="true"></span>
      <span v-else-if="$slots.leftIcon" class="btn-icon-left" style="display: inline-flex; align-items: center">
        <slot name="leftIcon" />
      </span>
      <slot />
      <span v-if="!isLoading && $slots.rightIcon" class="btn-icon-right" style="display: inline-flex; align-items: center">
        <slot name="rightIcon" />
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, inject, ref, onMounted, onUnmounted, watch } from 'vue';

type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
type ButtonColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'square' | 'rounded' | 'pill';

interface Props {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  shape?: ButtonShape;
  isLoading?: boolean;
  disabled?: boolean;
  value?: any;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  color: 'mauve',
  size: 'md',
  shape: 'rounded',
  isLoading: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const buttonEl = ref<HTMLElement | null>(null);

// Inject group context for radio/multi selection
const groupSelectionMode = inject<any>('buttonGroupSelectionMode', null);
const groupValue = inject<any>('buttonGroupValue', null);
const groupDisabled = inject<any>('buttonGroupDisabled', false);
const groupSelect = inject<any>('buttonGroupSelect', null);
const registerButton = inject<any>('registerButton', null);
const unregisterButton = inject<any>('unregisterButton', null);

const isActive = computed(() => {
  if (!groupSelectionMode || !groupSelectionMode.value || props.value === undefined) {
    return false;
  }
  if (groupSelectionMode.value === 'single') {
    return groupValue.value === props.value;
  }
  if (groupSelectionMode.value === 'multiple') {
    return Array.isArray(groupValue.value) && groupValue.value.includes(props.value);
  }
  return false;
});

onMounted(() => {
  if (registerButton && props.value !== undefined && buttonEl.value) {
    registerButton(props.value, buttonEl.value);
  }
});

watch(() => props.value, (newVal, oldVal) => {
  if (unregisterButton && oldVal !== undefined) {
    unregisterButton(oldVal);
  }
  if (registerButton && newVal !== undefined && buttonEl.value) {
    registerButton(newVal, buttonEl.value);
  }
});

onUnmounted(() => {
  if (unregisterButton && props.value !== undefined) {
    unregisterButton(props.value);
  }
});

const buttonClass = computed(() => {
  return 'btn';
});

function handleClick(event: MouseEvent) {
  if (groupSelect && props.value !== undefined) {
    groupSelect(props.value);
  }
  emit('click', event);
}
</script>
