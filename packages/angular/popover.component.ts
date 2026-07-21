import { Component, input, output, ElementRef, HostListener, inject, effect } from '@angular/core';

type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

@Component({
  selector: 'popover',
  standalone: true,
  template: `
    <div class="popover-trigger" #triggerRef>
      <ng-content select="[ctpPopoverTrigger]" />
    </div>
    @if (isOpen()) {
      <div
        #popoverRef
        class="popover" [attr.data-placement]="actualPlacement"
        [style.position]="'fixed'"
        [style.zIndex]="'1100'"
        [style.top.px]="top"
        [style.left.px]="left"
      >
        <div class="popover-arrow"></div>
        <ng-content />
      </div>
    }
  `,
})
export class PopoverComponent {
  placement = input<PopoverPlacement>('bottom');
  offset = input<number>(8);
  open = input<boolean | undefined>(undefined);

  openChange = output<boolean>();

  isOpen = false;
  top = 0;
  left = 0;
  actualPlacement: PopoverPlacement = 'bottom';

  private el = inject(ElementRef);

  constructor() {
    effect(() => {
      const controlled = this.open();
      if (controlled !== undefined) {
        this.isOpen = controlled;
        if (controlled) this.updatePosition();
      }
    });
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.openChange.emit(this.isOpen);
    if (this.isOpen) this.updatePosition();
  }

  openPopover(): void {
    this.isOpen = true;
    this.openChange.emit(true);
    this.updatePosition();
  }

  closePopover(): void {
    this.isOpen = false;
    this.openChange.emit(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen) return;
    const target = event.target as Node;
    const nativeEl = this.el.nativeElement as HTMLElement;
    if (!nativeEl.contains(target)) {
      this.closePopover();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.closePopover();
  }

  private updatePosition(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;
    const trigger = nativeEl.querySelector('[ctpPopoverTrigger]') as HTMLElement;
    const popover = nativeEl.querySelector('.popover') as HTMLElement;
    if (!trigger || !popover) return;

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();
    const offset = this.offset();

    this.actualPlacement = this.placement();
    this.top = triggerRect.bottom + offset;
    this.left = triggerRect.left;
  }
}
