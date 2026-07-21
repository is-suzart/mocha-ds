<template>
  <div :class="containerClasses">
    <table class="table">
      <thead>
        <tr>
          <th v-if="showCheckbox" style="width: 40px; text-align: center">
            <input
              type="checkbox"
              class="table-checkbox"
              :checked="allRowsSelected"
              ref="headerCheckbox"
              @change="handleSelectAll"
              :disabled="isLoading"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              col.sortable ? `${prefix}-table-th--sortable` : '',
              sortField === col.key ? `${prefix}-table-th--active` : '',
              col.align ? `${prefix}-table-cell--align-${col.align}` : `${prefix}-table-cell--align-left`,
              `${prefix}-table-th--key-${col.key}`,
            ]"
            @click="col.sortable && handleHeaderClick(col)"
            :style="{ cursor: col.sortable ? 'pointer' : 'default' }"
          >
            <div class="table-th-content">
              <span>{{ col.header }}</span>
              <span
                v-if="col.sortable"
                :class="[
                  `${prefix}-table-sort-icon`,
                  sortField === col.key ? `${prefix}-table-sort-icon--active` : '',
                ]"
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
        <template v-if="isLoading">
          <template v-for="rIdx in loadingRowsCount" :key="`skeleton-row-${rIdx}`">
            <tr v-if="rIdx === 1" class="table-header-spacer">
              <td :colspan="columns.length + (showCheckbox ? 1 : 0)">
                <div class="table-header-spacer-inner" />
              </td>
            </tr>
            <tr
              :class="[
                `${prefix}-table-skeleton-row`,
                rIdx === 1 ? `${prefix}-table-tr--first` : '',
                rIdx === loadingRowsCount ? `${prefix}-table-tr--last` : '',
              ]"
            >
              <td v-if="showCheckbox" style="text-align: center">
                <div class="table-skeleton-bar" style="width: 16px; margin: 0 auto" />
              </td>
              <td
                v-for="(col, colIdx) in columns"
                :key="`skeleton-cell-${col.key}`"
                :class="col.align ? `${prefix}-table-cell--align-${col.align}` : ''"
              >
                <div v-if="colIdx === 0" style="display: flex; align-items: center; gap: 8px">
                  <div class="table-skeleton-bar" style="width: 16px; height: 16px; border-radius: 4px" />
                  <div class="table-skeleton-bar" style="width: 70%" />
                </div>
                <div
                  v-else
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
        <template v-else-if="visibleRows.length === 0">
          <tr>
            <td :colspan="columns.length + (showCheckbox ? 1 : 0)" class="table-empty">
              {{ emptyState }}
            </td>
          </tr>
        </template>
        <template v-else>
          <template v-for="({ row, depth, hasChildren, isExpanded }, rowIndex) in visibleRows" :key="rowKey(row)">
            <tr v-if="rowIndex === 0" class="table-header-spacer">
              <td :colspan="columns.length + (showCheckbox ? 1 : 0)">
                <div class="table-header-spacer-inner" />
              </td>
            </tr>
            <tr
              :class="[
                activeSelectedSet.has(rowKey(row)) ? `${prefix}-table-tr--selected` : '',
                rowIndex === 0 ? `${prefix}-table-tr--first` : '',
                rowIndex === visibleRows.length - 1 ? `${prefix}-table-tr--last` : '',
              ]"
            >
              <td v-if="showCheckbox" style="text-align: center" @click.stop>
                <input
                  type="checkbox"
                  class="table-checkbox"
                  :checked="activeSelectedSet.has(rowKey(row))"
                  @change="handleSelectRow(rowKey(row), ($event.target as HTMLInputElement).checked)"
                  :aria-label="`Selecionar item ${rowKey(row)}`"
                />
              </td>
              <td
                v-for="(col, colIdx) in columns"
                :key="col.key"
                :class="[
                  col.align ? `${prefix}-table-cell--align-${col.align}` : `${prefix}-table-cell--align-left`,
                  `${prefix}-table-cell--key-${col.key}`,
                ]"
              >
                <div v-if="colIdx === 0" style="display: flex; align-items: center">
                  <!-- Indent guides -->
                  <div
                    v-for="i in depth"
                    :key="i"
                    class="tree-indent-guide"
                    style="width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative;"
                  >
                    <div
                      style="width: 1px; height: 100%; border-left: 1px dashed var(--ctp-surface2); position: absolute; left: 11px; top: 0; bottom: 0;"
                    />
                  </div>

                  <!-- Toggle expand button -->
                  <button
                    v-if="hasChildren"
                    type="button"
                    @click="toggleExpand(rowKey(row))"
                    class="tree-toggle-btn"
                    :aria-label="isExpanded ? 'Colapsar' : 'Expandir'"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      :style="{
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <div v-else style="width: 24px; height: 24px; flex-shrink: 0;" />

                  <!-- Value display -->
                  <span style="margin-left: 4px">
                    <template v-if="col.render">
                      <RenderWrapper :content="col.render(row, row[col.key], depth, isExpanded, hasChildren)" />
                    </template>
                    <template v-else-if="$slots[`cell-${col.key}`]">
                      <slot
                        :name="`cell-${col.key}`"
                        :row="row"
                        :value="row[col.key]"
                        :depth="depth"
                        :is-expanded="isExpanded"
                        :has-children="hasChildren"
                      />
                    </template>
                    <template v-else>
                      {{ row[col.key] }}
                    </template>
                  </span>
                </div>

                <div v-else>
                  <template v-if="col.render">
                    <RenderWrapper :content="col.render(row, row[col.key], depth, isExpanded, hasChildren)" />
                  </template>
                  <template v-else-if="$slots[`cell-${col.key}`]">
                    <slot
                      :name="`cell-${col.key}`"
                      :row="row"
                      :value="row[col.key]"
                      :depth="depth"
                      :is-expanded="isExpanded"
                      :has-children="hasChildren"
                    />
                  </template>
                  <template v-else>
                    {{ row[col.key] }}
                  </template>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch, useSlots, h } from 'vue';

export interface TreeColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  sortValue?: (row: T) => any;
  render?: (
    row: T,
    value: any,
    depth: number,
    isExpanded: boolean,
    hasChildren: boolean
  ) => any;
}

export type TableSize = 'sm' | 'md' | 'lg';
export type TableColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  data: T[];
  columns: TreeColumn<T>[];
  rowKey: (row: T) => string | number;
  childrenKey?: string;
  cascadeSelection?: boolean;
  size?: TableSize;
  color?: TableColor;
  isLoading?: boolean;
  loadingRowsCount?: number;
  emptyState?: string;
  globalFilter?: string;
  globalFilterFields?: string[];
  selectedRowIds?: (string | number)[];
}

const props = withDefaults(defineProps<Props>(), {
  childrenKey: 'children',
  cascadeSelection: true,
  size: 'md',
  color: 'mauve',
  isLoading: false,
  loadingRowsCount: 5,
  emptyState: 'Nenhum registro encontrado.',
  globalFilter: '',
  globalFilterFields: () => [],
});

const prefix = 'ctp';

// Controlled/Uncontrolled model bindings using defineModel
const sortField = defineModel<string>('sortField', { default: '' });
const sortOrder = defineModel<'asc' | 'desc' | ''>('sortOrder', { default: '' });
const expandedRowIds = defineModel<(string | number)[]>('expandedRowIds');
const selectedRowIds = defineModel<(string | number)[]>('selectedRowIds');

// Local fallbacks if not bound using defineModel
const internalExpandedIds = ref<Set<string | number>>(new Set());
const internalSelectedIds = ref<(string | number)[]>([]);

// Compute active expansion state
const activeExpandedIds = computed(() => {
  if (expandedRowIds.value !== undefined) {
    return new Set(expandedRowIds.value);
  }
  return internalExpandedIds.value;
});

// Compute active selection state
const activeSelectedIds = computed(() => {
  if (selectedRowIds.value !== undefined) {
    return selectedRowIds.value;
  }
  if (props.selectedRowIds !== undefined) {
    return props.selectedRowIds;
  }
  return internalSelectedIds.value;
});

const activeSelectedSet = computed(() => new Set(activeSelectedIds.value));

// Functional wrapper component to render HTML/VNode render props cleanly
const RenderWrapper = (wrapperProps: { content: any }) => {
  if (typeof wrapperProps.content === 'object' && wrapperProps.content !== null) {
    return wrapperProps.content;
  }
  return h('span', String(wrapperProps.content ?? ''));
};

const containerClasses = computed(() => {
  return [
    `${prefix}-table-container`,
    `${prefix}-table--${props.size}`,
    `${prefix}-table--${props.color}`,
  ].filter(Boolean).join(' ');
});

const showCheckbox = computed(() => {
  return selectedRowIds.value !== undefined || props.selectedRowIds !== undefined;
});

// Watch globalFilter to auto-expand matched nodes' parents
watch(
  () => props.globalFilter,
  (newQuery) => {
    if (newQuery && props.data.length > 0) {
      const matchedParentIds = new Set<string | number>();
      
      const findMatchesAndParents = (nodes: T[], path: (string | number)[]) => {
        nodes.forEach(node => {
          const id = props.rowKey(node);
          const currentPath = [...path, id];
          
          const hasMatch = props.globalFilterFields.some(field => {
            const val = (node as any)[field];
            return (
              val !== undefined &&
              val !== null &&
              String(val).toLowerCase().includes(newQuery.toLowerCase())
            );
          });

          if (hasMatch) {
            path.forEach(parentId => matchedParentIds.add(parentId));
          }

          const children = (node as any)[props.childrenKey];
          if (Array.isArray(children)) {
            findMatchesAndParents(children, currentPath);
          }
        });
      };

      findMatchesAndParents(props.data, []);

      if (matchedParentIds.size > 0) {
        if (expandedRowIds.value !== undefined) {
          expandedRowIds.value = Array.from(matchedParentIds);
        } else {
          internalExpandedIds.value = matchedParentIds;
        }
      }
    }
  },
  { immediate: true }
);

// Selection checkbox helpers (indeterminate state update)
const headerCheckbox = ref<HTMLInputElement | null>(null);

const totalVisibleNodesCount = computed(() => {
  let count = 0;
  const countNodes = (nodes: T[]) => {
    nodes.forEach(node => {
      count++;
      const children = (node as any)[props.childrenKey];
      if (Array.isArray(children)) countNodes(children);
    });
  };
  countNodes(processedData.value);
  return count;
});

const allRowsSelected = computed(() => {
  if (totalVisibleNodesCount.value === 0) return false;
  let allSelected = true;
  const checkNodes = (nodes: T[]): boolean => {
    for (const node of nodes) {
      if (!activeSelectedSet.value.has(props.rowKey(node))) {
        allSelected = false;
        return false;
      }
      const children = (node as any)[props.childrenKey];
      if (Array.isArray(children)) {
        if (!checkNodes(children)) return false;
      }
    }
    return true;
  };
  checkNodes(processedData.value);
  return allSelected;
});

const someRowsSelected = computed(() => {
  if (totalVisibleNodesCount.value === 0 || activeSelectedSet.value.size === 0) return false;
  let selectedCount = 0;
  const countSelected = (nodes: T[]) => {
    nodes.forEach(node => {
      if (activeSelectedSet.value.has(props.rowKey(node))) {
        selectedCount++;
      }
      const children = (node as any)[props.childrenKey];
      if (Array.isArray(children)) countSelected(children);
    });
  };
  countSelected(processedData.value);
  return selectedCount > 0 && selectedCount < totalVisibleNodesCount.value;
});

watch([allRowsSelected, someRowsSelected], () => {
  if (headerCheckbox.value) {
    headerCheckbox.value.indeterminate = someRowsSelected.value;
  }
});

// Tree Table logic helpers
function getAllChildIds(node: T): (string | number)[] {
  const children = (node as any)[props.childrenKey] as T[] | undefined;
  if (!Array.isArray(children)) return [];
  const ids: (string | number)[] = [];
  for (const child of children) {
    ids.push(props.rowKey(child));
    ids.push(...getAllChildIds(child));
  }
  return ids;
}

function filterTreeData(data: T[], query: string): T[] {
  if (!query) return data;
  const lowercaseQuery = query.toLowerCase();

  const filterNode = (node: T): T | null => {
    const children = (node as any)[props.childrenKey] as T[] | undefined;
    let filteredChildren: T[] = [];
    if (Array.isArray(children)) {
      filteredChildren = children
        .map(child => filterNode(child))
        .filter(Boolean) as T[];
    }

    const selfMatches = props.globalFilterFields.some(field => {
      const val = (node as any)[field];
      return (
        val !== undefined &&
        val !== null &&
        String(val).toLowerCase().includes(lowercaseQuery)
      );
    });

    if (selfMatches || filteredChildren.length > 0) {
      return {
        ...node,
        [props.childrenKey]: filteredChildren,
      };
    }
    return null;
  };

  return data.map(node => filterNode(node)).filter(Boolean) as T[];
}

function sortTreeData(data: T[], field: string, order: 'asc' | 'desc' | ''): T[] {
  if (!field || !order) return data;

  const sorted = [...data];
  const column = props.columns.find(c => c.key === field);

  sorted.sort((a: any, b: any) => {
    const aVal = column?.sortValue ? column.sortValue(a) : a[field];
    const bVal = column?.sortValue ? column.sortValue(b) : b[field];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted.map(item => {
    const children = (item as any)[props.childrenKey];
    if (Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [props.childrenKey]: sortTreeData(children, field, order),
      };
    }
    return item;
  });
}

interface FlattenedTreeRow {
  row: T;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  parentId: string | number | null;
  path: (string | number)[];
}

function flattenTreeNodes(
  nodes: T[],
  depth: number,
  parentId: string | number | null,
  path: (string | number)[],
  expandedIds: Set<string | number>,
  result: FlattenedTreeRow[] = []
): FlattenedTreeRow[] {
  for (const node of nodes) {
    const id = props.rowKey(node);
    const children = (node as any)[props.childrenKey];
    const hasChildren = Array.isArray(children) && children.length > 0;
    const isExpanded = expandedIds.has(id);
    const nodePath = [...path, id];

    result.push({
      row: node,
      depth,
      hasChildren,
      isExpanded,
      parentId,
      path: nodePath,
    });

    if (hasChildren && isExpanded) {
      flattenTreeNodes(
        children,
        depth + 1,
        id,
        nodePath,
        expandedIds,
        result
      );
    }
  }
  return result;
}

function updateSelectionCascading(
  targetNodeId: string | number,
  checked: boolean
): (string | number)[] {
  const selectedSet = new Set(activeSelectedIds.value);

  // Find target node in the tree structure
  let targetNode: T | null = null;
  const findNode = (nodes: T[]): boolean => {
    for (const node of nodes) {
      if (props.rowKey(node) === targetNodeId) {
        targetNode = node;
        return true;
      }
      const children = (node as any)[props.childrenKey] as T[] | undefined;
      if (Array.isArray(children) && findNode(children)) {
        return true;
      }
    }
    return false;
  };
  findNode(props.data);

  if (!targetNode) return activeSelectedIds.value;

  // 1. Update target and its descendants (downward propagation)
  const descendants = getAllChildIds(targetNode);
  if (checked) {
    selectedSet.add(targetNodeId);
    descendants.forEach(id => selectedSet.add(id));
  } else {
    selectedSet.delete(targetNodeId);
    descendants.forEach(id => selectedSet.delete(id));
  }

  // 2. Build map of parents and siblings to propagate upwards
  const parentMap = new Map<
    string | number,
    { parentId: string | number; siblingIds: (string | number)[] }
  >();
  const buildParentMap = (nodes: T[], parentId: string | number | null) => {
    const siblingIds = nodes.map(n => props.rowKey(n));
    for (const node of nodes) {
      const id = props.rowKey(node);
      if (parentId !== null) {
        parentMap.set(id, { parentId, siblingIds });
      }
      const children = (node as any)[props.childrenKey] as T[] | undefined;
      if (Array.isArray(children)) {
        buildParentMap(children, id);
      }
    }
  };
  buildParentMap(props.data, null);

  // 3. Propagate upward
  let currentId = targetNodeId;
  while (parentMap.has(currentId)) {
    const info = parentMap.get(currentId)!;
    const parentId = info.parentId;
    const siblingIds = info.siblingIds;

    const allSiblingsSelected = siblingIds.every(id => selectedSet.has(id));
    if (allSiblingsSelected) {
      selectedSet.add(parentId);
    } else {
      selectedSet.delete(parentId);
    }
    currentId = parentId;
  }

  return Array.from(selectedSet);
}

// Data Pipeline
const processedData = computed(() => {
  let result = props.data;
  if (props.globalFilter && props.globalFilterFields.length > 0) {
    result = filterTreeData(result, props.globalFilter);
  }
  if (sortField.value && sortOrder.value) {
    result = sortTreeData(result, sortField.value, sortOrder.value);
  }
  return result;
});

const visibleRows = computed(() => {
  return flattenTreeNodes(
    processedData.value,
    0,
    null,
    [],
    activeExpandedIds.value
  );
});

// Event Handlers
function handleHeaderClick(column: TreeColumn<T>) {
  let nextOrder: 'asc' | 'desc' | '' = 'asc';
  if (sortField.value === column.key) {
    if (sortOrder.value === 'asc') {
      nextOrder = 'desc';
    } else if (sortOrder.value === 'desc') {
      nextOrder = '';
    } else {
      nextOrder = 'asc';
    }
  }
  sortField.value = nextOrder === '' ? '' : column.key;
  sortOrder.value = nextOrder;
}

function toggleExpand(rowId: string | number) {
  const nextSet = new Set(activeExpandedIds.value);
  if (nextSet.has(rowId)) {
    nextSet.delete(rowId);
  } else {
    nextSet.add(rowId);
  }
  if (expandedRowIds.value !== undefined) {
    expandedRowIds.value = Array.from(nextSet);
  } else {
    internalExpandedIds.value = nextSet;
  }
}

function handleSelectRow(targetNodeId: string | number, checked: boolean) {
  let nextSelected: (string | number)[] = [];
  if (props.cascadeSelection) {
    nextSelected = updateSelectionCascading(targetNodeId, checked);
  } else {
    const nextSet = new Set(activeSelectedIds.value);
    if (checked) {
      nextSet.add(targetNodeId);
    } else {
      nextSet.delete(targetNodeId);
    }
    nextSelected = Array.from(nextSet);
  }

  if (selectedRowIds.value !== undefined) {
    selectedRowIds.value = nextSelected;
  } else {
    internalSelectedIds.value = nextSelected;
  }
}

function handleSelectAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  let nextSelected: (string | number)[] = [];
  if (checked) {
    const allIds: (string | number)[] = [];
    const addAllIds = (nodes: T[]) => {
      nodes.forEach(node => {
        allIds.push(props.rowKey(node));
        const children = (node as any)[props.childrenKey];
        if (Array.isArray(children)) addAllIds(children);
      });
    };
    addAllIds(processedData.value);
    nextSelected = allIds;
  } else {
    nextSelected = [];
  }

  if (selectedRowIds.value !== undefined) {
    selectedRowIds.value = nextSelected;
  } else {
    internalSelectedIds.value = nextSelected;
  }
}
</script>
