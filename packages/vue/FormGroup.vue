<template>
  <div class="form-group">
    <label v-if="label" :for="htmlFor" class="form-group-label">
      {{ label }}
      <span v-if="required" class="form-group-required-indicator" aria-hidden="true">*</span>
    </label>
    <slot />
    <span v-if="error" class="form-group-error" role="alert">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {{ error }}
    </span>
    <span v-else-if="description" class="form-group-description">{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
}

withDefaults(defineProps<Props>(), {
  required: false,
});
</script>
