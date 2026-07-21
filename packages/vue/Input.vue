<template>
  <input
    class="form-control"
    :data-size="size"
    :data-shape="shape"
    :data-state="error ? 'error' : undefined"
    :data-color="color"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    :type="type"
    @input="onInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">


type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlShape = 'square' | 'rounded' | 'pill';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string | number;
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
  type: 'text',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `form--${color}`;



function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>
