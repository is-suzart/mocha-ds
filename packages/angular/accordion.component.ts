import { Component, input, computed, output, signal, effect, inject } from '@angular/core';

export type AccordionVariant = 'default' | 'split';
export type AccordionColorMode = 'none' | 'colored' | 'tonal';
export type AccordionAccentColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

@Component({
  selector: 'accordion',
  standalone: true,
  template: `
    <div class="accordion"
      [attr.data-variant]="variant()"
      [attr.data-color]="colorMode() !== 'none' ? colorMode() : null"
      [attr.data-accent]="accentColor() || null"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class CptAccordionComponent {
  variant = input<AccordionVariant>('default');
  colorMode = input<AccordionColorMode>('none');
  accentColor = input<AccordionAccentColor | undefined>(undefined);
  allowMultiple = input<boolean>(false);
  activeValues = input<string | string[]>([]);

  activeValuesChange = output<string | string[]>();

  private openValuesSignal = signal<string[]>([]);
  openValues = this.openValuesSignal.asReadonly();

  constructor() {
    effect(() => {
      const externalVal = this.activeValues();
      const nextVal = Array.isArray(externalVal) ? externalVal : (externalVal ? [externalVal] : []);
      const currentVal = this.openValuesSignal();
      const hasChanged = currentVal.length !== nextVal.length || !currentVal.every((v, i) => v === nextVal[i]);
      if (hasChanged) {
        this.openValuesSignal.set(nextVal);
      }
    }, { allowSignalWrites: true });
  }

  toggleValue(value: string) {
    const current = this.openValuesSignal();
    let next: string[];
    if (this.allowMultiple()) {
      next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
    } else {
      next = current.includes(value) ? [] : [value];
    }
    this.openValuesSignal.set(next);
    this.activeValuesChange.emit(this.allowMultiple() ? next : (next[0] || ''));
  }
}

@Component({
  selector: 'accordion-item',
  standalone: true,
  template: `
    <div class="accordion-item" [attr.data-state]="isOpen() ? 'open' : (disabled() ? 'disabled' : null)">
      <button
        type="button"
        class="accordion-header"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        (click)="handleHeaderClick()"
      >
        <span class="accordion-title">
          @if (title()) {
            {{ title() }}
          }
          <ng-content select="[header]"></ng-content>
        </span>
        @if (showChevron()) {
          <svg
            class="accordion-chevron"
            viewBox="0 0 24 24"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        }
      </button>

      <div
        class="accordion-collapse"
        [attr.aria-hidden]="!isOpen()"
      >
        <div class="accordion-content">
          <div class="accordion-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CptAccordionItemComponent {
  value = input.required<string>();
  title = input<string | undefined>(undefined);
  disabled = input<boolean>(false);
  showChevron = input<boolean>(true);

  private accordion = inject(CptAccordionComponent, { optional: true });

  isOpen = computed(() => {
    if (!this.accordion) return false;
    return this.accordion.openValues().includes(this.value());
  });

  handleHeaderClick() {
    if (this.disabled() || !this.accordion) return;
    this.accordion.toggleValue(this.value());
  }
}
