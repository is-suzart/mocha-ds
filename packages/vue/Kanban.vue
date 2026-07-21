<template>
  <div :class="['pro-kanban-board', `pro-kanban-board--${color}`, className]">
    <div
      v-for="column in columns"
      :key="column.id"
      :class="['pro-kanban-column', `pro-kanban-column--${column.color || color}`]"
      @dragover.prevent
      @drop="onDropColumn($event, column.id)"
    >
      <!-- Column Header Custom Slot / Props / Default -->
      <slot
        v-if="$slots['column-header']"
        name="column-header"
        :column="column"
        :column-items="getColumnItems(column.id)"
      />
      <component
        v-else-if="renderColumnHeader"
        :is="renderColumnHeader(column, getColumnItems(column.id))"
      />
      <div v-else class="pro-kanban-column-header">
        <div class="pro-kanban-column-title-container">
          <span class="pro-kanban-column-dot" />
          <h3 class="pro-kanban-column-title">{{ column.title }}</h3>
        </div>
        <span class="pro-kanban-column-badge">{{ getColumnItems(column.id).length }}</span>
      </div>

      <!-- Column Cards Container -->
      <div class="pro-kanban-cards-container">
        <div
          v-for="item in getColumnItems(column.id)"
          :key="item.id"
          draggable="true"
          @dragstart="onDragStart($event, item)"
          @dragend="onDragEnd"
          @dragover.prevent
          @dragenter.prevent="onDragEnterCard($event, item)"
          :class="[
            'pro-kanban-card',
            draggedItem?.id === item.id ? 'pro-kanban-card--dragging' : '',
          ]"
          @click="handleCardClick(item)"
        >
          <!-- Card Content Slot / Props / Default -->
          <slot
            v-if="$slots.item"
            name="item"
            :item="item"
          />
          <component
            v-else-if="renderItem"
            :is="renderItem(item)"
          />
          <template v-else>
            <div class="pro-kanban-card-title">{{ item.title }}</div>
            <div v-if="item.description" class="pro-kanban-card-desc">
              {{ item.description }}
            </div>
            <div v-if="item.tags && item.tags.length > 0" class="pro-kanban-card-tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="pro-kanban-card-tag"
              >
                {{ tag }}
              </span>
            </div>
          </template>
        </div>

        <div
          v-if="getColumnItems(column.id).length === 0"
          class="pro-kanban-empty-column-placeholder"
        >
          Solte itens aqui
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanItem {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

interface Props {
  columns: KanbanColumn[];
  items: KanbanItem[];
  renderItem?: (item: KanbanItem) => any;
  renderColumnHeader?: (column: KanbanColumn, columnItems: KanbanItem[]) => any;
  className?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  columns: () => [],
  className: '',
  color: 'mauve',
});

const emit = defineEmits<{
  (e: 'update:items', items: KanbanItem[]): void;
  (e: 'items-change', items: KanbanItem[]): void;
  (e: 'item-click', item: KanbanItem): void;
}>();

const draggedItem = ref<KanbanItem | null>(null);

function getColumnItems(columnId: string): KanbanItem[] {
  return props.items.filter((item) => item.columnId === columnId);
}

function onDragStart(event: DragEvent, item: KanbanItem) {
  draggedItem.value = item;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.id);
  }
}

function onDragEnd() {
  draggedItem.value = null;
}

function onDragEnterCard(event: DragEvent, targetItem: KanbanItem) {
  if (!draggedItem.value || draggedItem.value.id === targetItem.id) return;

  const currentItems = [...props.items];
  const activeIndex = currentItems.findIndex((i) => i.id === draggedItem.value!.id);
  const targetIndex = currentItems.findIndex((i) => i.id === targetItem.id);

  if (activeIndex !== -1 && targetIndex !== -1) {
    const updatedDragged = { ...draggedItem.value, columnId: targetItem.columnId };
    currentItems.splice(activeIndex, 1);
    currentItems.splice(targetIndex, 0, updatedDragged);
    emit('update:items', currentItems);
    emit('items-change', currentItems);
    draggedItem.value = updatedDragged;
  }
}

function onDropColumn(event: DragEvent, columnId: string) {
  if (!draggedItem.value) return;

  const currentItems = [...props.items];
  const activeIndex = currentItems.findIndex((i) => i.id === draggedItem.value!.id);

  if (activeIndex !== -1) {
    const item = currentItems[activeIndex];
    if (item.columnId !== columnId) {
      currentItems.splice(activeIndex, 1);
      currentItems.push({ ...item, columnId });
      emit('update:items', currentItems);
      emit('items-change', currentItems);
    }
  }
  draggedItem.value = null;
}

function handleCardClick(item: KanbanItem) {
  emit('item-click', item);
}
</script>
