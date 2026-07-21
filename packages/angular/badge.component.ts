import { Component, input, computed, output } from '@angular/core';

export type BadgeVariant = 'filled' | 'tonal' | 'outline' | 'flat';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'square' | 'rounded' | 'pill';
export type BadgeColor =
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
  selector: 'badge',
  standalone: true,
  template: `
    <span
      [class]="badgeClass()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [attr.data-color]="color()"
    >
      @if (hasIcon()) {
        <span class="badge-icon" style="display: inline-flex; align-items: center">
          <ng-content select="[icon]"></ng-content>
        </span>
      }
      <span class="badge-content">
        <ng-content></ng-content>
      </span>
      @if (isDismissible()) {
        <button
          class="badge-close-btn"
          (click)="onDismiss($event)"
          aria-label="Dismiss badge"
          style="display: inline-flex; align-items: center; margin-left: 4px;"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }
    </span>
  `
})
export class BadgeComponent {
  variant = input<BadgeVariant>('filled');
  size = input<BadgeSize>('md');
  shape = input<BadgeShape>('pill');
  color = input<BadgeColor>('mauve');
  hasIcon = input<boolean>(false);
  isDismissible = input<boolean>(false);

  dismiss = output<MouseEvent>();

  onDismiss(event: MouseEvent) {
    this.dismiss.emit(event);
  }

  badgeClass = computed(() => {
    return 'badge';
  });
}
