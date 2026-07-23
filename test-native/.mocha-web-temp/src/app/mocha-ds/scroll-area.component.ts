import { Component, input, ViewChild, ElementRef, HostListener, signal, computed } from '@angular/core';

@Component({
  selector: 'scroll-area',
  standalone: true,
  template: `
    <div class="scroll-area" [style.height]="height()">
      <div #viewport class="scroll-area-viewport" (scroll)="updateThumbs()">
        <ng-content />
      </div>
      @if (showVertical()) {
        <div class="scroll-area-scrollbar" data-orientation="vertical" [style.opacity]="isDraggingV ? 1 : 0.6">
          <div
            class="scroll-area-thumb"
            [style.height.px]="thumbHeight()"
            [style.transform]="'translateY(' + thumbTop() + 'px)'"
            (mousedown)="startDragV($event)"
          ></div>
        </div>
      }
      @if (showHorizontal()) {
        <div class="scroll-area-scrollbar" data-orientation="horizontal" [style.opacity]="isDraggingH ? 1 : 0.6">
          <div
            class="scroll-area-thumb"
            [style.width.px]="thumbWidth()"
            [style.transform]="'translateX(' + thumbLeft() + 'px)'"
            (mousedown)="startDragH($event)"
          ></div>
        </div>
      }
      @if (showVertical() && showHorizontal()) {
        <div class="scroll-area-corner"></div>
      }
    </div>
  `
})
export class ScrollAreaComponent {
  height = input<string>('100%');

  @ViewChild('viewport') viewportEl!: ElementRef<HTMLDivElement>;

  showVertical = signal(false);
  showHorizontal = signal(false);
  thumbTop = signal(0);
  thumbLeft = signal(0);
  thumbHeight = signal(0);
  thumbWidth = signal(0);
  isDraggingV = false;
  isDraggingH = false;

  updateThumbs(): void {
    const vp = this.viewportEl?.nativeElement;
    if (!vp) return;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = vp;
    this.showVertical.set(scrollHeight > clientHeight);
    this.showHorizontal.set(scrollWidth > clientWidth);

    if (scrollHeight > clientHeight) {
      this.thumbHeight.set((clientHeight / scrollHeight) * clientHeight);
      this.thumbTop.set((scrollTop / scrollHeight) * clientHeight);
    }
    if (scrollWidth > clientWidth) {
      this.thumbWidth.set((clientWidth / scrollWidth) * clientWidth);
      this.thumbLeft.set((scrollLeft / scrollWidth) * clientWidth);
    }
  }

  startDragV(e: MouseEvent): void {
    e.preventDefault();
    this.isDraggingV = true;
    const vp = this.viewportEl.nativeElement;
    const startY = e.clientY;
    const startScrollTop = vp.scrollTop;

    const onMove = (ev: MouseEvent) => {
      const dy = ev.clientY - startY;
      const ratio = dy / (vp.clientHeight - this.thumbHeight());
      vp.scrollTop = startScrollTop + ratio * (vp.scrollHeight - vp.clientHeight);
    };

    const onUp = () => {
      this.isDraggingV = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  startDragH(e: MouseEvent): void {
    e.preventDefault();
    this.isDraggingH = true;
    const vp = this.viewportEl.nativeElement;
    const startX = e.clientX;
    const startScrollLeft = vp.scrollLeft;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const ratio = dx / (vp.clientWidth - this.thumbWidth());
      vp.scrollLeft = startScrollLeft + ratio * (vp.scrollWidth - vp.clientWidth);
    };

    const onUp = () => {
      this.isDraggingH = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }
}
