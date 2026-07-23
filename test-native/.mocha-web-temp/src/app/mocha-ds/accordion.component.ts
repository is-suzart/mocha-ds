import { Component, input, computed, output, signal, inject, OnInit } from '@angular/core';

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
  host: {
    '[class.accordion]': 'true',
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'colorMode() !== "none" ? colorMode() : null',
    '[attr.data-accent]': 'accentColor() || null',
  },
  template: `<ng-content></ng-content>`
})
export class AccordionComponent implements OnInit {
  variant = input<AccordionVariant>('default');
  colorMode = input<AccordionColorMode>('none');
  accentColor = input<AccordionAccentColor | undefined>(undefined);
  allowMultiple = input<boolean>(false);
  defaultValue = input<string | string[] | undefined>(undefined);
  value = input<string | string[] | undefined>(undefined);

  valueChange = output<string | string[]>();

  private openValuesSignal = signal<string[]>([]);
  private defaultValueApplied = false;

  ngOnInit(): void {
    const dv = this.defaultValue();
    if (dv !== undefined) {
      this.openValuesSignal.set(Array.isArray(dv) ? dv : [dv]);
    }
    this.defaultValueApplied = true;
  }

  isControlled = computed(() => this.value() !== undefined);

  openValues = computed<string[]>(() => {
    if (this.isControlled()) {
      const v = this.value();
      return Array.isArray(v) ? v : [v!];
    }
    return this.openValuesSignal();
  });

  toggleValue(itemValue: string): void {
    let next: string[];
    const current = this.openValues();

    if (this.allowMultiple()) {
      next = current.includes(itemValue)
        ? current.filter(v => v !== itemValue)
        : [...current, itemValue];
    } else {
      next = current.includes(itemValue) ? [] : [itemValue];
    }

    if (!this.isControlled()) {
      this.openValuesSignal.set(next);
    }

    this.valueChange.emit(this.allowMultiple() ? next : (next[0] || ''));
  }
}

@Component({
  selector: 'accordion-item',
  standalone: true,
  host: {
    '[class.accordion-item]': 'true',
    '[attr.data-state]': 'isOpen() ? "open" : (disabled() ? "disabled" : null)',
  },
  template: `
    <button
      type="button"
      class="accordion-header"
      [disabled]="disabled()"
      [attr.aria-expanded]="isOpen()"
      (click)="handleClick()"
    >
      <span class="accordion-title">
        <ng-content select="[header]"></ng-content>
      </span>
      @if (showChevron()) {
        <svg class="accordion-chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      }
    </button>
    <div class="accordion-collapse" [attr.aria-hidden]="!isOpen()">
      <div class="accordion-content">
        <div class="accordion-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class AccordionItemComponent {
  value = input.required<string>();
  disabled = input<boolean>(false);
  showChevron = input<boolean>(true);

  private accordion = inject(AccordionComponent, { optional: true });

  isOpen = computed((): boolean => {
    if (this.accordion) {
      return this.accordion.openValues().includes(this.value());
    }
    return false;
  });

  handleClick(): void {
    if (this.disabled()) return;
    if (this.accordion) {
      this.accordion.toggleValue(this.value());
    }
  }
}

@Component({
  selector: 'accordion-header',
  standalone: true,
  template: `
    <button
      type="button"
      class="accordion-header"
      [disabled]="innerDisabled()"
      [attr.aria-expanded]="innerIsOpen()"
      (click)="headerClick.emit()"
    >
      <span class="accordion-title">
        <ng-content></ng-content>
      </span>
      @if (showChevron()) {
        <svg class="accordion-chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      }
    </button>
  `
})
export class AccordionHeaderComponent {
  showChevron = input<boolean>(true);
  innerDisabled = input<boolean>(false);
  innerIsOpen = input<boolean>(false);
  innerValue = input<string>('');
  headerClick = output<void>();
}

@Component({
  selector: 'accordion-body',
  standalone: true,
  host: { '[class.accordion-body]': 'true' },
  template: `<ng-content></ng-content>`
})
export class AccordionBodyComponent {}
