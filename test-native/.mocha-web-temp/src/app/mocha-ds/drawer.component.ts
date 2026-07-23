import { Component, input, output, computed } from '@angular/core';
import { OverlayComponent } from './overlay.component';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type DrawerColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

@Component({
  selector: 'drawer',
  standalone: true,
  imports: [OverlayComponent],
  template: `
    <overlay
      [isOpen]="isOpen()"
      [closeOnOverlayClick]="closeOnOverlayClick()"
      [closeOnEsc]="closeOnEsc()"
      [placement]="'drawer-' + position()"
      (close)="onClose()"
    >
      <div
        class="drawer"
        [attr.data-placement]="position()"
        [attr.data-size]="size()"
        [attr.data-color]="color()"
        role="dialog"
        aria-modal="true"
      >
        @if (title() || showCloseButton()) {
          <div class="drawer-header">
            <div class="drawer-title" id="drawer-title">
              {{ title() }}
            </div>
            @if (showCloseButton()) {
              <button class="drawer-close-btn" (click)="onClose()" aria-label="Close drawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>
        }
        <div class="drawer-body">
          <ng-content></ng-content>
        </div>
        @if (footer()) {
          <div class="drawer-footer">{{ footer() }}</div>
        }
      </div>
    </overlay>
  `
})
export class DrawerComponent {
  isOpen = input<boolean>(false);
  position = input<DrawerPosition>('right');
  size = input<DrawerSize>('md');
  color = input<DrawerColor>('mauve');
  title = input<string>('');
  footer = input<string>('');
  closeOnOverlayClick = input<boolean>(true);
  closeOnEsc = input<boolean>(true);
  showCloseButton = input<boolean>(true);

  close = output<void>();

  onClose() {
    this.close.emit();
  }
}
