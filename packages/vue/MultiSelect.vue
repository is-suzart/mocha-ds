<template>
  <div :class="containerClass" style="position:relative" ref="wrapperRef">
    <div class="multi-select-trigger" @click="toggleOpen">
      <span v-if="selectedLabels.length > 0" class="multi-select-tags">
        <span v-for="label in selectedLabels" :key="label" class="multi-select-tag">{{ label }}</span>
      </span>
      <span v-else class="multi-select-placeholder">{{ placeholder }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <Teleport to="body" v-if="isOpen">
      <div
        class="multi-select-dropdown"
        :style="dropdownStyle"
      >
        <input
          v-if="searchable"
          class="multi-select-search"
          type="text"
          placeholder="Buscar..."
          v-model="searchQuery"
        />
        <div class="multi-select-options">
          <label
            v-for="opt in filteredOptions"
            :key="opt.value"
            class="multi-select-option"
          >
            <input
              type="checkbox"
              :checked="isSelected(opt.value)"
              @change="toggleOption(opt.value)"
            />
            <span>{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  options?: SelectOption[];
  modelValue?: string[];
  placeholder?: string;
  searchable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  modelValue: () => [],
  placeholder: 'Selecione...',
  searchable: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const wrapperRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');

const containerClass = computed(() => ['multi-select']);

const selectedLabels = computed(() => {
  return props.options
    .filter(o => props.modelValue.includes(o.value))
    .map(o => o.label);
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return props.options;
  return props.options.filter(o => o.label.toLowerCase().includes(query));
});

const dropdownStyle = ref({});

function isSelected(val: string): boolean {
  return props.modelValue.includes(val);
}

function toggleOpen() {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) searchQuery.value = '';

  if (isOpen.value && wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect();
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 1050,
    };
  }
}

function toggleOption(val: string) {
  const current = [...props.modelValue];
  const idx = current.indexOf(val);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(val);
  }
  emit('update:modelValue', current);
}

const handleClick = (e: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false;
    searchQuery.value = '';
  }
};

onMounted(() => {
  document.addEventListener('click', handleClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClick);
});
</script>
