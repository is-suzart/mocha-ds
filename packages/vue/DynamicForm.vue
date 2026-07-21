<template>
  <form class="dynamic-form" @submit.prevent="onSubmit">
    <div class="form-grid">
      <div
        v-for="field in schema"
        :key="field.id"
        class="form-group form-col-12"
      >
        <label class="form-group-label">
          {{ field.label }}
          <span v-if="field.required" class="form-group-required-indicator">*</span>
        </label>

        <textarea
          v-if="field.type === 'textarea'"
          class="form-control form-control--md form-control--rounded"
          :placeholder="field.placeholder"
          :value="formValues[field.id]"
          @input="setValue(field.id, ($event.target as HTMLTextAreaElement).value)"
        ></textarea>

        <select
          v-else-if="field.type === 'select'"
          class="form-control form-control--md form-control--rounded"
          :value="formValues[field.id]"
          @change="setValue(field.id, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Selecione...</option>
          <option v-for="opt in (field.options || [])" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <label v-else-if="field.type === 'checkbox'" class="checkbox-row">
          <input
            type="checkbox"
            :checked="formValues[field.id] || false"
            @change="setChecked(field.id, ($event.target as HTMLInputElement).checked)"
          />
          <span class="checkbox-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span>{{ field.label }}</span>
        </label>

        <input
          v-else
          :type="field.type"
          class="form-control form-control--md form-control--rounded"
          :placeholder="field.placeholder"
          :value="formValues[field.id]"
          @input="setValue(field.id, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div style="margin-top:16px">
      <button
        type="submit"
        class="btn btn--filled btn--mauve btn--md btn--rounded"
      >
        {{ submitText }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface FieldOption {
  label: string;
  value: any;
}

interface FieldSchema {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: FieldOption[];
}

interface Props {
  schema: FieldSchema[];
  submitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  schema: () => [],
  submitText: 'Enviar',
});

const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void;
}>();

const formValues = reactive<Record<string, any>>({});

// Initialize form values from schema defaults
for (const field of props.schema) {
  formValues[field.id] = field.defaultValue ?? '';
}

function setValue(id: string, value: any) {
  formValues[id] = value;
}

function setChecked(id: string, checked: boolean) {
  formValues[id] = checked;
}

function onSubmit() {
  emit('submit', { ...formValues });
}
</script>
