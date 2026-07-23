import { Component, input, output, OnDestroy, ElementRef, ViewChild, effect } from '@angular/core';

let activeOverlayCount = 0;

@Component({
  selector: 'overlay',
  standalone: true,
  template: `
    @if (shouldRender) {
      <div
        #overlayElement
        class="overlay"
        [attr.data-state]="isAnimatedIn ? 'open' : null"
        [attr.data-placement]="placement()"
        [style.zIndex]="zIndex"
        (click)="handleOverlayClick($event)"
        role="presentation"
      >
        <ng-content></ng-content>
      </div>
    }
  `
})
export class OverlayComponent implements OnDestroy {
  isOpen = input<boolean>(false);
  closeOnOverlayClick = input<boolean>(true);
  closeOnEsc = input<boolean>(true);
  placement = input<string>('');

  close = output<void>();

  @ViewChild('overlayElement') overlayElement!: ElementRef;

  shouldRender = false;
  isAnimatedIn = false;
  zIndex = 1000;
  private timeoutId: any = null;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      clearTimeout(this.timeoutId);
      if (open) {
        activeOverlayCount++;
        this.zIndex = 1000 + activeOverlayCount;
        this.shouldRender = true;
        document.body.style.overflow = 'hidden';

        this.timeoutId = setTimeout(() => {
          this.isAnimatedIn = true;
        }, 10);

        window.addEventListener('keydown', this.handleKeyDown);
      } else {
        this.isAnimatedIn = false;
        window.removeEventListener('keydown', this.handleKeyDown);

        this.timeoutId = setTimeout(() => {
          this.shouldRender = false;
          if (activeOverlayCount > 0) {
            activeOverlayCount--;
          }
          if (activeOverlayCount === 0) {
            document.body.style.overflow = '';
          }
        }, 200);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.isOpen()) {
      if (activeOverlayCount > 0) {
        activeOverlayCount--;
      }
      if (activeOverlayCount === 0) {
        document.body.style.overflow = '';
      }
    }
  }

  handleOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlayClick() && event.target === this.overlayElement.nativeElement) {
      this.close.emit();
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen() && this.closeOnEsc()) {
      if (this.zIndex === 1000 + activeOverlayCount) {
        this.close.emit();
      }
    }
  };
}
