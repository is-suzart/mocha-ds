import { Component, input, ElementRef, HostListener, inject } from '@angular/core';

type HoverCardPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

@Component({
  selector: 'hover-card',
  standalone: true,
  template: `
    <span class="hover-card-trigger" #triggerRef
      (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()"
      (focusin)="onFocus()" (focusout)="onBlur()"
    >
      <ng-content select="[ctpHoverCardTrigger]" />
    </span>
    @if (isVisible) {
      <div
        #cardRef
        class="hover-card" [attr.data-placement]="actualPlacement"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        [style.top.px]="top"
        [style.left.px]="left"
        (mouseenter)="onCardEnter()"
        (mouseleave)="onCardLeave()"
      >
        <div class="hover-card-arrow"></div>
        <ng-content />
      </div>
    }
  `,
})
export class HoverCardComponent {
  placement = input<HoverCardPlacement>('bottom');
  offset = input<number>(8);
  openDelay = input<number>(400);
  closeDelay = input<number>(300);

  isVisible = false;
  top = 0;
  left = 0;
  actualPlacement: HoverCardPlacement = 'bottom';
  private timeoutId: any = null;
  private el = inject(ElementRef);

  onMouseEnter(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.isVisible = true;
      this.updatePosition();
    }, this.openDelay());
  }

  onMouseLeave(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.isVisible = false;
    }, this.closeDelay());
  }

  onFocus(): void {
    clearTimeout(this.timeoutId);
    this.isVisible = true;
    this.updatePosition();
  }

  onBlur(): void {
    clearTimeout(this.timeoutId);
    this.isVisible = false;
  }

  onCardEnter(): void {
    clearTimeout(this.timeoutId);
  }

  onCardLeave(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.isVisible = false;
    }, this.closeDelay());
  }

  private updatePosition(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const trigger = nativeEl.querySelector('[ctpHoverCardTrigger]') as HTMLElement;
    const card = nativeEl.querySelector('.hover-card') as HTMLElement;
    if (!trigger || !card) return;

    const triggerRect = trigger.getBoundingClientRect();
    const offset = this.offset();

    this.actualPlacement = this.placement();
    this.top = triggerRect.bottom + offset;
    this.left = triggerRect.left;
  }
}
