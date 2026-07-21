<template>
  <div class="tabs" :data-orientation="orientation" :data-color="color">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { useRouter } from 'vue-router';

export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsMode = 'state' | 'router';
export type TabColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string;
  variant?: TabsVariant;
  size?: string;
  color?: TabColor;
  orientation?: TabsOrientation;
  mode?: TabsMode;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  color: 'mauve',
  orientation: 'horizontal',
  mode: 'state',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const router = useRouter();

const activeValue = ref(props.modelValue || '');

const selectTab = (val: string) => {
  activeValue.value = val;
  emit('update:modelValue', val);
};

const navigateTo = (val: string) => {
  if (props.mode === 'router') {
    router.push(val);
  }
};

provide('tabs', {
  activeValue,
  selectTab,
  navigateTo,
  variant: computed(() => props.variant),
  size: computed(() => props.size),
  color: computed(() => props.color),
  orientation: computed(() => props.orientation),
  mode: computed(() => props.mode),
});
</script>
