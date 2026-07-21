<template>
  <select
    class="form-control"
    :data-size="size"
    :data-shape="shape"
    :data-state="error ? 'error' : undefined"
    :data-color="color"
    :disabled="disabled"
    :value="modelValue"
    @change="onChange"
    v-bind="$attrs"
  >
    <slot />
    <option
      v-for="(opt, idx) in options"
      :key="idx"
      :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup lang="ts">


type FormControlSize = 'sm' | 'md' | 'lg';
type FormControlShape = 'square' | 'rounded' | 'pill';
type FormControlColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface SelectOption {
  label: string;
  value: any;
}

interface Props {
  modelValue?: any;
  size?: FormControlSize;
  shape?: FormControlShape;
  color?: FormControlColor;
  error?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'rounded',
  color: 'mauve',
  error: false,
  disabled: false,
  options: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const getFormThemeClass = (color: FormControlColor) => `form--${color}`;



function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>
