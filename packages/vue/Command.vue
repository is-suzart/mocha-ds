<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="command-overlay"
      @click.self="close"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div class="command">
        <div class="command-input-wrapper">
          <svg class="command-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref="inputEl"
            v-model="query"
            class="command-input"
            :placeholder="placeholder"
            @keydown="onKeyDown"
          />
        </div>
        <div class="command-list">
          <div v-if="flatFiltered.length === 0" class="command-empty">{{ emptyMessage }}</div>
          <template v-else>
            <div v-for="group in groupKeys" :key="group">
              <div class="command-group-label">{{ group }}</div>
              <div
                v-for="(item, i) in grouped[group]"
                :key="item.id"
                class="command-item" :data-state="flatFiltered.indexOf(item) === selectedIndex ? 'selected' : undefined"
                @click="selectItem(item)"
                @mouseenter="selectedIndex = flatFiltered.indexOf(item)"
              >
                <span class="command-item-label">{{ item.label }}</span>
                <span v-if="item.shortcut" class="command-item-shortcut">{{ item.shortcut }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  onSelect?: () => void;
}

interface Props {
  items: CommandItem[];
  open?: boolean;
  placeholder?: string;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search commands...',
  emptyMessage: 'No results found.',
});

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void;
}>();

const isOpen = ref(props.open ?? false);
const query = ref('');
const selectedIndex = ref(0);
const inputEl = ref<HTMLInputElement>();

watch(() => props.open, (val) => {
  if (val !== undefined) {
    isOpen.value = val;
    if (val) {
      query.value = '';
      selectedIndex.value = 0;
      nextTick(() => inputEl.value?.focus());
    }
  }
});

function toggle() {
  isOpen.value = !isOpen.value;
  emit('update:open', isOpen.value);
  if (isOpen.value) {
    query.value = '';
    selectedIndex.value = 0;
    nextTick(() => inputEl.value?.focus());
  }
}

function close() {
  isOpen.value = false;
  emit('update:open', false);
}

function onKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggle();
    return;
  }
  if (e.key === 'Escape') { close(); return; }

  const flat = flatFiltered.value;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, flat.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (e.key === 'Enter' && flat[selectedIndex.value]) {
    flat[selectedIndex.value].onSelect?.();
    close();
  }
}

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  return props.items.filter(item => item.label.toLowerCase().includes(q));
});

const grouped = computed(() => {
  const groups: Record<string, CommandItem[]> = {};
  for (const item of filtered.value) {
    const g = item.group || 'General';
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  }
  return groups;
});

const groupKeys = computed(() => Object.keys(grouped.value));
const flatFiltered = computed(() => filtered.value);

function selectItem(item: CommandItem) {
  item.onSelect?.();
  close();
}

defineExpose({ toggle, close, isOpen });
</script>
