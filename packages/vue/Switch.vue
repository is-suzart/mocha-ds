<template>
  <label class="switch-row" :data-state="disabled ? 'disabled' : undefined" :data-color="color">
    <input
      type="checkbox"
      :disabled="disabled"
      :checked="modelValue"
      @change="onToggle"
    />
    <span class="switch-track">
      <span class="switch-thumb"></span>
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
