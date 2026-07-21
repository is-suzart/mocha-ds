import { Component, input, computed, HostListener, ElementRef } from '@angular/core';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: '[tooltip]',
  standalone: true,
  template: `
    <ng-content></ng-content>
    @if (isVisible) {
      <div
        [class]="tooltipClass()"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        role="tooltip"
      >
        <div class="tooltip-content">{{ content() }}</div>
        <div class="tooltip-arrow"></div>
      </div>
    }
  `,
  host: {
    '[style.position]': '"relative"',
  }
})
export class TooltipDirective {
  content = input.required<string>();
  placement = input<TooltipPlacement>('top');
  color = input<string>('dark');
  delay = input<number>(200);

  isVisible = false;
  private timeoutId: any = null;

  constructor(private el: ElementRef) {}

  protected tooltipClass = computed(() => {
    const colorClass = this.color() === 'dark' || this.color() === 'light'
      ? `tooltip--preset-${this.color()}`
      : `tooltip--${this.color()}`;
    return [
      'tooltip',
      `tooltip--placement-${this.placement()}`,
      colorClass,
    ].filter(Boolean).join(' ');
  });

  @HostListener('mouseenter')
  onMouseEnter() {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.isVisible = true;
    }, this.delay());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearTimeout(this.timeoutId);
    this.isVisible = false;
  }

  @HostListener('focusin')
  onFocus() {
    clearTimeout(this.timeoutId);
    this.isVisible = true;
  }

  @HostListener('focusout')
  onBlur() {
    clearTimeout(this.timeoutId);
    this.isVisible = false;
  }
}
