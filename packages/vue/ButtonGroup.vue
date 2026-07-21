<template>
  <div
    ref="containerRef"
    class="btn-group"
    :data-orientation="orientation"
    :data-variant="variant"
    :data-shape="shape"
    :data-state="[
      props.selectionMode === 'single' && pillReady ? 'pill-active' : '',
      props.selectionMode !== 'none' ? props.selectionMode : ''
    ].filter(Boolean).join(' ') || undefined"
    :role="selectionMode === 'single' ? 'radiogroup' : undefined"
    @keydown="handleKeyDown"
  >
    <div
      v-if="props.selectionMode === 'single'"
      class="btn-group-pill"
      :style="pillStyle"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

export type ButtonGroupVariant = 'filled' | 'outline' | 'ghost';
type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

interface Props {
  orientation?: 'horizontal' | 'vertical';
  variant?: ButtonGroupVariant;
  shape?: 'square' | 'rounded' | 'pill';
  selectionMode?: ButtonGroupSelectionMode;
  modelValue?: any;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  variant: 'filled',
  shape: 'rounded',
  selectionMode: 'none',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
  (e: 'change', value: any): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const buttonElements = ref<Map<any, HTMLElement>>(new Map());

const pillStyle = ref({
  transform: 'translate(0px, 0px)',
  width: '0px',
  height: '0px',
  opacity: '0',
  pointerEvents: 'none',
});

const pillReady = ref(false);

const updatePill = () => {
  nextTick(() => {
    if (!containerRef.value || props.selectionMode !== 'single') {
      pillStyle.value = { ...pillStyle.value, opacity: '0', pointerEvents: 'none' };
      pillReady.value = false;
      return;
    }

    const activeEl = buttonElements.value.get(props.modelValue);
    if (!activeEl) {
      pillStyle.value = { ...pillStyle.value, opacity: '0', pointerEvents: 'none' };
      pillReady.value = false;
      return;
    }

    const containerRect = containerRef.value.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const left = activeRect.left - containerRect.left;
    const top = activeRect.top - containerRect.top;
    const width = activeRect.width;
    const height = activeRect.height;

    pillStyle.value = {
      transform: `translate(${left}px, ${top}px)`,
      width: `${width}px`,
      height: `${height}px`,
      opacity: '1',
      pointerEvents: 'none',
    };
    pillReady.value = true;
  });
};

watch(() => props.modelValue, updatePill);
watch(() => props.selectionMode, updatePill);

let resizeObserver: ResizeObserver | null = null;
onMounted(() => {
  updatePill();
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updatePill();
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

const registerButton = (value: any, element: HTMLElement) => {
  buttonElements.value.set(value, element);
  updatePill();
};

const unregisterButton = (value: any) => {
  buttonElements.value.delete(value);
  updatePill();
};

provide('buttonGroupSelectionMode', computed(() => props.selectionMode));
provide('buttonGroupValue', computed(() => props.modelValue));
provide('buttonGroupDisabled', computed(() => props.disabled));
provide('registerButton', registerButton);
provide('unregisterButton', unregisterButton);

provide('buttonGroupSelect', (btnValue: any) => {
  if (props.selectionMode === 'none') return;

  if (props.selectionMode === 'single') {
    emit('update:modelValue', btnValue);
    emit('change', btnValue);
  } else if (props.selectionMode === 'multiple') {
    const currentValues = Array.isArray(props.modelValue) ? props.modelValue : [];
    let nextValue;
    if (currentValues.includes(btnValue)) {
      nextValue = currentValues.filter((v: any) => v !== btnValue);
    } else {
      nextValue = [...currentValues, btnValue];
    }
    emit('update:modelValue', nextValue);
    emit('change', nextValue);
  }
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (props.selectionMode !== 'single') return;

  const keys = Array.from(buttonElements.value.keys());
  const currentIndex = keys.indexOf(props.modelValue);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % keys.length;
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + keys.length) % keys.length;
    e.preventDefault();
  }

  if (nextIndex !== currentIndex) {
    const nextValue = keys[nextIndex];
    emit('update:modelValue', nextValue);
    emit('change', nextValue);
    nextTick(() => {
      const nextEl = buttonElements.value.get(nextValue);
      nextEl?.focus();
    });
  }
};

</script>
