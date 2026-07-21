<template>
  <textarea
    class="form-control"
    :data-size="size"
    :data-shape="shape"
    :data-state="error ? 'error' : undefined"
    :data-color="color"
    :disabled="disabled"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs"
  ></textarea>
</template>

<script setup lang="ts">


type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string;
  size?: FormControlSize;
  shape?: 'square' | 'rounded';
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `form--${color}`;



function onInput(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>
