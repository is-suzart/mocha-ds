import { Component, input, output, signal, computed } from '@angular/core';

export interface FieldSchema {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
}

@Component({
  selector: 'dynamic-form',
  standalone: true,
  template: `
    <form [class]="'dynamic-form'" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        @for (field of schema(); track field.id) {
          <div class="form-group" [class.form-col-12]="true">
            <label class="form-group-label">
              {{ field.label }}
              @if (field.required) {
                <span class="form-group-required-indicator">*</span>
              }
            </label>

            @switch (field.type) {
              @case ('textarea') {
                <textarea
                  class="form-control form-control--md form-control--rounded"
                  [placeholder]="field.placeholder || ''"
                  [value]="values()[field.id] || ''"
                  (input)="setValue(field.id, $event)"
                ></textarea>
              }
              @case ('select') {
                <select
                  class="form-control form-control--md form-control--rounded"
                  [value]="values()[field.id] || ''"
                  (change)="setValue(field.id, $event)"
                >
                  <option value="">Selecione...</option>
                  @for (opt of field.options || []; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              }
              @case ('checkbox') {
                <label class="checkbox-row">
                  <input
                    type="checkbox"
                    [checked]="values()[field.id] || false"
                    (change)="setChecked(field.id, $event)"
                  />
                  <span class="checkbox-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>{{ field.label }}</span>
                </label>
              }
              @default {
                <input
                  [type]="field.type"
                  class="form-control form-control--md form-control--rounded"
                  [placeholder]="field.placeholder || ''"
                  [value]="values()[field.id] || ''"
                  (input)="setValue(field.id, $event)"
                />
              }
            }
          </div>
        }
      </div>
      <div style="margin-top:16px">
        <button
          type="submit"
          class="btn btn--filled btn--mauve btn--md btn--rounded"
        >
          {{ submitText() }}
        </button>
      </div>
    </form>
  `
})
export class DynamicFormComponent {
  schema = input<FieldSchema[]>([]);
  submitText = input<string>('Enviar');

  submit = output<Record<string, any>>();

  private formValues = signal<Record<string, any>>({});

  values = computed(() => {
    const init: Record<string, any> = {};
    for (const field of this.schema()) {
      init[field.id] = this.formValues()[field.id] ?? field.defaultValue ?? '';
    }
    return init;
  });

  setValue(id: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.formValues.update(v => ({ ...v, [id]: target.value }));
  }

  setChecked(id: string, event: Event) {
    const target = event.target as HTMLInputElement;
    this.formValues.update(v => ({ ...v, [id]: target.checked }));
  }

  onSubmit() {
    this.submit.emit(this.values());
  }
}
