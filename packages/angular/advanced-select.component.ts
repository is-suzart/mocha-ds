import { Component, input, computed, output, signal, ElementRef } from '@angular/core';

export type SelectColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'multi-select',
  standalone: true,
  template: `
    <div [class]="containerClass()" style="position:relative">
      <div
        class="multi-select-trigger"
        (click)="toggleOpen()"
      >
        @if (selectedLabels().length > 0) {
          <span class="multi-select-tags">
            @for (label of selectedLabels(); track label) {
              <span class="multi-select-tag">{{ label }}</span>
            }
          </span>
        } @else {
          <span class="multi-select-placeholder">{{ placeholder() }}</span>
        }
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      @if (isOpen()) {
        <div class="multi-select-dropdown" style="position:absolute;top:100%;left:0;right:0;z-index:1050">
          @if (searchable()) {
            <input
              class="multi-select-search"
              type="text"
              placeholder="Buscar..."
              (input)="onSearch($event)"
            />
          }
          <div class="multi-select-options">
            @for (opt of filteredOptions(); track opt.value) {
              <label class="multi-select-option">
                <input
                  type="checkbox"
                  [checked]="isSelected(opt.value)"
                  (change)="toggleOption(opt.value)"
                />
                <span>{{ opt.label }}</span>
              </label>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MultiSelectComponent {
  options = input<SelectOption[]>([]);
  value = input<string[]>([]);
  placeholder = input<string>('Selecione...');
  searchable = input<boolean>(true);
  color = input<SelectColor>('mauve');

  valueChange = output<string[]>();

  isOpen = signal(false);
  searchQuery = signal('');

  constructor(private el: ElementRef) {
    this.handleClickOutside();
  }

  protected containerClass = computed(() => {
    return ['multi-select'].filter(Boolean).join(' ');
  });

  protected selectedLabels = computed(() => {
    return this.options()
      .filter(o => this.value().includes(o.value))
      .map(o => o.label);
  });

  protected filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.options();
    return this.options().filter(o => o.label.toLowerCase().includes(query));
  });

  isSelected(val: string): boolean {
    return this.value().includes(val);
  }

  toggleOpen() {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) this.searchQuery.set('');
  }

  toggleOption(val: string) {
    const current = [...this.value()];
    const idx = current.indexOf(val);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(val);
    }
    this.valueChange.emit(current);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  private handleClickOutside() {
    document.addEventListener('click', (e: MouseEvent) => {
      if (!this.el.nativeElement.contains(e.target as Node)) {
        this.isOpen.set(false);
        this.searchQuery.set('');
      }
    });
  }
}
