import { Component, input, output } from '@angular/core';
import { OverlayComponent } from './overlay.component';

export type ModalSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [OverlayComponent],
  template: `
    <overlay
      [isOpen]="isOpen()"
      [closeOnOverlayClick]="closeOnOverlayClick()"
      [closeOnEsc]="closeOnEsc()"
      (close)="close.emit()"
    >
      <div class="modal" [attr.data-size]="size()" role="dialog" aria-modal="true">
        @if (hasHeader()) {
          <div class="modal-header">
            <div class="modal-title">
              @if (title()) {
                {{ title() }}
              }
              <ng-content select="[header]"></ng-content>
            </div>
            @if (showCloseButton()) {
              <button
                class="modal-close-btn"
                (click)="close.emit()"
                aria-label="Close modal"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            }
          </div>
        }
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        @if (hasFooter()) {
          <div class="modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        }
      </div>
    </overlay>
  `
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  size = input<ModalSize>('md');
  title = input<string>('');
  closeOnOverlayClick = input<boolean>(true);
  closeOnEsc = input<boolean>(true);
  showCloseButton = input<boolean>(true);
  hasFooter = input<boolean>(false);

  close = output<void>();

  hasHeader = (): boolean => {
    return !!(this.title() || this.showCloseButton());
  };
}
