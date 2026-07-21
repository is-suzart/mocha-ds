<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="breadcrumb-separator" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </span>
      <a v-if="item.href && index < items.length - 1" :href="item.href" class="breadcrumb-item">
        {{ item.label }}
      </a>
      <span
        v-else
        class="breadcrumb-item" :data-state="index === items.length - 1 ? 'active' : undefined"
        :aria-current="index === items.length - 1 ? 'page' : undefined"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

defineProps<Props>();
</script>
