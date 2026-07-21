<template>
  <label class="checkbox-row" :data-state="disabled ? 'disabled' : undefined" :data-color="color">
    <input
      type="checkbox"
      :disabled="disabled"
      :checked="modelValue"
      @change="onToggle"
    />
    <span class="checkbox-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">


type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  label: string;
  modelValue?: boolean;
  disabled?: boolean;
  color?: FormControlColor;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  color: 'mauve',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `form--${color}`;



function onToggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>
