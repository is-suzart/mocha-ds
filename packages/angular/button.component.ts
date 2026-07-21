import {
  Component,
  input,
  computed,
  Optional,
  HostListener,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ButtonGroupComponent } from './button-group.component';

type ButtonVariant = 'filled' | 'tonal' | 'outline' | 'ghost';
type ButtonColor =
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
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonShape = 'square' | 'rounded' | 'pill';

@Component({
  selector: 'button',
  standalone: true,
  template: `
    <button
      [class]="buttonClass()"
      [disabled]="disabled() || isGroupDisabled() || isLoading()"
      [attr.role]="isGroupSingle() ? 'radio' : null"
      [attr.aria-checked]="isGroupSingle() ? isActive() : null"
      [attr.tabindex]="isGroupSingle() ? (isActive() ? 0 : -1) : 0"
      [attr.data-variant]="variant()"
      [attr.data-color]="color()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [attr.data-state]="isLoading() ? 'loading' : (isActive() ? 'active' : null)"
    >
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
    </button>
  `
})
export class ButtonComponent implements AfterViewInit, OnDestroy, OnChanges {
  variant = input<ButtonVariant>('filled');
  color = input<ButtonColor>('mauve');
  size = input<ButtonSize>('md');
  shape = input<ButtonShape>('rounded');
  isLoading = input<boolean>(false);
  disabled = input<boolean>(false);
  value = input<any>(null);

  constructor(
    @Optional() public buttonGroup: ButtonGroupComponent,
    private el: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.selectButton(this.value());
    }
  }

  isGroupSingle = computed(() => {
    return this.buttonGroup ? this.buttonGroup.selectionMode() === 'single' : false;
  });

  isGroupDisabled = computed(() => {
    return this.buttonGroup ? this.buttonGroup.disabled() : false;
  });

  isActive = computed(() => {
    if (this.buttonGroup && this.value() !== null) {
      return this.buttonGroup.isButtonActive(this.value());
    }
    return false;
  });

  buttonClass = computed(() => {
    return 'btn';
  });

  ngAfterViewInit() {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.registerButton(this.value(), this.el.nativeElement.querySelector('button'));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.buttonGroup) {
      const prev = changes['value'].previousValue;
      const curr = changes['value'].currentValue;
      if (prev !== null && prev !== undefined) {
        this.buttonGroup.unregisterButton(prev);
      }
      if (curr !== null && curr !== undefined) {
        this.buttonGroup.registerButton(curr, this.el.nativeElement.querySelector('button'));
      }
    }
  }

  ngOnDestroy() {
    if (this.buttonGroup && this.value() !== null) {
      this.buttonGroup.unregisterButton(this.value());
    }
  }
}
