<template>
  <div :class="containerClass">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showCheckbox" style="width: 40px; text-align: center">
            <input
              type="checkbox"
              class="table-checkbox"
              :checked="allSelected"
              :indeterminate="someSelected"
              @change="handleSelectAll"
              :disabled="isLoading"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              col.sortable ? 'table-th--sortable' : '',
              sortField === col.key ? 'table-th--active' : '',
              `table-cell--align-${col.align || 'left'}`,
            ]"
            :aria-sort="sortField === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined"
            @click="col.sortable && toggleSort(col.key)"
          >
            <div class="table-th-content">
              {{ col.header }}
              <span
                v-if="col.sortable"
                :class="['table-sort-icon', sortField === col.key ? 'table-sort-icon--active' : '']"
              >
                <svg v-if="sortField === col.key && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                <svg v-else-if="sortField === col.key && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.4">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!isLoading && data.length === 0">
          <td :colspan="colspan" class="table-empty">
            {{ emptyState }}
          </td>
        </tr>

        <template v-if="isLoading">
          <template v-for="rIdx in loadingRowsCount" :key="'sk-' + rIdx">
            <tr v-if="rIdx === 1" class="table-header-spacer">
              <td :colspan="colspan">
                <div class="table-header-spacer-inner" />
              </td>
            </tr>
            <tr
              :class="[
                'table-skeleton-row',
                rIdx === 1 ? 'table-tr--first' : '',
                rIdx === loadingRowsCount ? 'table-tr--last' : '',
              ]"
            >
              <td v-if="showCheckbox" style="text-align: center">
                <div class="table-skeleton-bar" style="width: 16px; margin: 0 auto" />
              </td>
              <td
                v-for="col in columns"
                :key="'sk-' + col.key"
                :class="col.align ? `table-cell--align-${col.align}` : ''"
              >
                <div
                  class="table-skeleton-bar"
                  :style="{
                    width: col.align === 'right' ? '70%' : col.align === 'center' ? '50%' : '85%',
                    marginLeft: col.align === 'right' ? 'auto' : col.align === 'center' ? 'auto' : '0',
                    marginRight: col.align === 'center' ? 'auto' : '0',
                  }"
                />
              </td>
            </tr>
          </template>
        </template>

        <template v-else v-for="(row, idx) in sortedData" :key="rowKey(row)">
          <tr v-if="idx === 0" class="table-header-spacer">
            <td :colspan="colspan">
              <div class="table-header-spacer-inner" />
            </td>
          </tr>
          <tr
            :class="[
              isSelected(row) ? 'table-tr--selected' : '',
              idx === 0 ? 'table-tr--first' : '',
              idx === sortedData.length - 1 ? 'table-tr--last' : '',
            ]"
          >
            <td v-if="showCheckbox" style="text-align: center" @click.stop>
              <input
                type="checkbox"
                class="table-checkbox"
                :checked="isSelected(row)"
                @change="handleSelectRow(row, $event)"
              />
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[`table-cell--align-${col.align || 'left'}`, `table-cell--key-${col.key}`]"
              @dblclick="startEditing(row, col)"
              :title="col.editable ? 'Clique duas vezes para editar' : undefined"
            >
              <template v-if="isEditing(row, col)">
                <input
                  ref="editInput"
                  type="text"
                  class="table-inline-edit"
                  :value="editValue"
                  @input="editValue = $event.target.value"
                  @blur="saveEdit(row, col)"
                  @keydown.enter="saveEdit(row, col)"
                  @keydown.escape="cancelEdit"
                />
              </template>
              <template v-else-if="$slots[`cell-${col.key}`]">
                <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="idx" />
              </template>
              <template v-else>
                {{ row[col.key] }}
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'

export type TableSize = 'sm' | 'md' | 'lg'
export type TableColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender'

export interface Column {
  key: string
  header: string
  sortable?: boolean
  editable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface Props {
  data: any[]
  columns: Column[]
  rowKey: (row: any) => string | number
  size?: TableSize
  color?: TableColor
  emptyState?: string
  selectedRowIds?: (string | number)[]
  isLoading?: boolean
  loadingRowsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  rowKey: (row: any) => row.id,
  size: 'md',
  color: 'mauve',
  emptyState: 'No records found.',
  selectedRowIds: undefined,
  isLoading: false,
  loadingRowsCount: 5,
})

const emit = defineEmits<{
  (e: 'update:sortField', value: string): void
  (e: 'update:sortOrder', value: 'asc' | 'desc' | ''): void
  (e: 'update:selectedRowIds', value: (string | number)[]): void
  (e: 'cellEdit', rowId: string | number, columnKey: string, newValue: any): void
}>()

const sortField = defineModel<string>('sortField', { default: '' })
const sortOrder = defineModel<'asc' | 'desc' | ''>('sortOrder', { default: '' })

const editInput = ref<HTMLInputElement | null>(null)
const editingRowId = ref<string | number | null>(null)
const editingColKey = ref<string | null>(null)
const editValue = ref<string>('')

const containerClass = computed(() => {
  return [
    'table-container',
    `table--${props.size}`,
    `table--${props.color}`,
  ]
})

const showCheckbox = computed(() => props.selectedRowIds !== undefined)

const colspan = computed(() => {
  return props.columns.length + (showCheckbox.value ? 1 : 0)
})

const selectedSet = computed(() => {
  return new Set(props.selectedRowIds || [])
})

const allSelected = computed(() => {
  if (props.data.length === 0 || !props.selectedRowIds) return false
  return props.data.every(row => selectedSet.value.has(props.rowKey(row)))
})

const someSelected = computed(() => {
  if (!props.selectedRowIds || props.data.length === 0) return false
  const count = props.data.filter(row => selectedSet.value.has(props.rowKey(row))).length
  return count > 0 && count < props.data.length
})

const sortedData = computed(() => {
  const rows = [...props.data]
  if (sortField.value && sortOrder.value) {
    rows.sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  return rows
})

function toggleSort(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? '' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

function isSelected(row: any): boolean {
  if (!props.selectedRowIds) return false
  return selectedSet.value.has(props.rowKey(row))
}

function handleSelectAll(e: Event) {
  if (!props.selectedRowIds) return
  const target = e.target as HTMLInputElement
  if (target.checked) {
    emit('update:selectedRowIds', props.data.map(row => props.rowKey(row)))
  } else {
    emit('update:selectedRowIds', [])
  }
}

function handleSelectRow(row: any, e: Event) {
  if (!props.selectedRowIds) return
  const target = e.target as HTMLInputElement
  const id = props.rowKey(row)
  const current = [...props.selectedRowIds]
  if (target.checked) {
    current.push(id)
  } else {
    const idx = current.indexOf(id)
    if (idx !== -1) current.splice(idx, 1)
  }
  emit('update:selectedRowIds', current)
}

function isEditing(row: any, col: Column): boolean {
  return editingRowId.value === props.rowKey(row) && editingColKey.value === col.key
}

function startEditing(row: any, col: Column) {
  if (!col.editable) return
  editingRowId.value = props.rowKey(row)
  editingColKey.value = col.key
  editValue.value = String(row[col.key] ?? '')
  nextTick(() => {
    const el = editInput.value
    if (el) {
      if (Array.isArray(el)) {
        (el[0] as HTMLInputElement | undefined)?.focus()
        (el[0] as HTMLInputElement | undefined)?.select()
      } else {
        (el as HTMLInputElement).focus()
        (el as HTMLInputElement).select()
      }
    }
  })
}

function saveEdit(row: any, col: Column) {
  if (editingRowId.value === null) return
  emit('cellEdit', props.rowKey(row), col.key, editValue.value)
  cancelEdit()
}

function cancelEdit() {
  editingRowId.value = null
  editingColKey.value = null
  editValue.value = ''
}
</script>
