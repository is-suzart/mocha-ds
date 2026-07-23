import {
  Component,
  input,
  computed,
  output,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Optional
} from '@angular/core';
import { ButtonGroupComponent } from './button-group.component';

export type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
export type ButtonColor =
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
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'square' | 'rounded' | 'pill';

@Component({
  selector: 'button[btn]',
  standalone: true,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-color]': 'color()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-state]': 'resolvedState()',
    '[class.btn]': 'true',
    '[disabled]': 'isDisabled()',
    '[attr.role]': 'isGroupSingle() ? "radio" : null',
    '[attr.aria-checked]': 'isGroupSingle() ? isActive() : null',
    '[attr.tabindex]': 'isGroupSingle() ? (isActive() ? 0 : -1) : 0',
  },
  template: `
    <span class="btn-content">
      @if (isLoading()) {
        <span class="btn-spinner" aria-hidden="true"></span>
      }
      <span class="btn-icon-left" style="display: inline-flex; align-items: center">
        <ng-content select="[leftIcon]"></ng-content>
      </span>
      <ng-content></ng-content>
      <span class="btn-icon-right" style="display: inline-flex; align-items: center">
        <ng-content select="[rightIcon]"></ng-content>
      </span>
    </span>
  `
})
export class ButtonComponent implements AfterViewInit, OnDestroy {
  variant = input<ButtonVariant>('filled');
  color = input<ButtonColor>('mauve');
  size = input<ButtonSize>('md');
  shape = input<ButtonShape>('rounded');
  isLoading = input<boolean>(false);
  leftIcon = input<string>('');
  rightIcon = input<string>('');
  value = input<any>(undefined);
  disabled = input<boolean>(false);

  click = output<MouseEvent>();

  private buttonGroup = inject(ButtonGroupComponent, { optional: true });
  private el = inject(ElementRef);

  isGroupSingle = computed((): boolean => {
    return this.buttonGroup ? this.buttonGroup.selectionMode() === 'single' : false;
  });

  isGroupDisabled = computed((): boolean => {
    return this.buttonGroup ? this.buttonGroup.disabled() : false;
  });

  isDisabled = computed((): boolean => {
    return this.disabled() || this.isGroupDisabled() || this.isLoading();
  });

  isActive = computed((): boolean => {
    if (!this.buttonGroup || this.value() === null || this.value() === undefined) return false;
    return this.buttonGroup.isButtonActive(this.value());
  });

  resolvedState = computed((): string | undefined => {
    if (this.isLoading()) return 'loading';
    if (this.isActive()) return 'active';
    return undefined;
  });

  handleClick(event: MouseEvent): void {
    if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
      this.buttonGroup.selectButton(this.value());
    }
    this.click.emit(event);
  }

  ngAfterViewInit() {
    if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
      this.buttonGroup.registerButton(this.value(), this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.buttonGroup && this.value() !== null && this.value() !== undefined) {
      this.buttonGroup.unregisterButton(this.value());
    }
  }
}
