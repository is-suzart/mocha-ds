import {
  Component,
  input,
  computed,
  output,
  model,
  forwardRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ButtonGroupVariant = 'filled' | 'outline' | 'ghost';
export type ButtonGroupSelectionMode = 'none' | 'single' | 'multiple';

@Component({
  selector: 'button-group',
  standalone: true,
  template: `
    <div
      #container
      class="btn-group"
      [attr.data-orientation]="orientation()"
      [attr.data-variant]="variant()"
      [attr.data-shape]="shape()"
      [attr.data-state]="(selectionMode() === 'single' && isPillReady() ? 'pill-active ' : '') + (selectionMode() !== 'none' ? selectionMode() : '') || null"
      [attr.role]="selectionMode() === 'single' ? 'radiogroup' : null"
      (keydown)="handleKeyDown($event)"
    >
      @if (selectionMode() === 'single') {
        <div class="btn-group-pill" [style]="pillStyle()"></div>
      }
      <ng-content></ng-content>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonGroupComponent),
      multi: true
    }
  ]
})
export class ButtonGroupComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  variant = input<ButtonGroupVariant>('filled');
  shape = input<'square' | 'rounded' | 'pill'>('rounded');
  selectionMode = input<ButtonGroupSelectionMode>('none');
  
  value = model<any>(null);
  disabled = model<boolean>(false);
  
  change = output<any>();

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private buttonElementsMap = new Map<any, HTMLElement>();
  private resizeObserver?: ResizeObserver;

  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  private isPillReady = computed(() => {
    const style = this.pillStyle();
    return !('opacity' in style);
  });

  pillStyle = computed(() => {
    const activeVal = this.value();
    const mode = this.selectionMode();
    if (mode !== 'single' || activeVal === null || activeVal === undefined) {
      return { opacity: '0', pointerEvents: 'none' };
    }

    const activeEl = this.buttonElementsMap.get(activeVal);
    if (!activeEl || !this.containerRef) {
      return { opacity: '0', pointerEvents: 'none' };
    }

    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const left = activeRect.left - containerRect.left;
    const top = activeRect.top - containerRect.top;
    const width = activeRect.width;
    const height = activeRect.height;

    return {
      transform: `translate(${left}px, ${top}px)`,
      width: `${width}px`,
      height: `${height}px`
    };
  });

  ngAfterViewInit() {
    if (typeof ResizeObserver !== 'undefined' && this.containerRef) {
      this.resizeObserver = new ResizeObserver(() => {
        this.cdr.detectChanges();
      });
      this.resizeObserver.observe(this.containerRef.nativeElement);
    }
    // Initial compute cycle
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  registerButton(val: any, el: HTMLElement) {
    this.buttonElementsMap.set(val, el);
    this.cdr.detectChanges();
  }

  unregisterButton(val: any) {
    this.buttonElementsMap.delete(val);
    this.cdr.detectChanges();
  }

  selectButton(btnValue: any): void {
    if (this.disabled()) return;
    const mode = this.selectionMode();
    if (mode === 'none' || btnValue === undefined || btnValue === null) return;

    let nextVal: any;
    if (mode === 'single') {
      nextVal = btnValue;
    } else if (mode === 'multiple') {
      const currentVal = this.value();
      const currentArray = Array.isArray(currentVal) ? currentVal : [];
      if (currentArray.includes(btnValue)) {
        nextVal = currentArray.filter((v: any) => v !== btnValue);
      } else {
        nextVal = [...currentArray, btnValue];
      }
    }

    this.value.set(nextVal);
    this.onChangeFn(nextVal);
    this.onTouchedFn();
    this.change.emit(nextVal);
    this.cdr.detectChanges();
  }

  isButtonActive(btnValue: any): boolean {
    const mode = this.selectionMode();
    const currentVal = this.value();
    if (mode === 'none' || btnValue === undefined || btnValue === null) return false;

    if (mode === 'single') {
      return currentVal === btnValue;
    }
    if (mode === 'multiple') {
      return Array.isArray(currentVal) && currentVal.includes(btnValue);
    }
    return false;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value.set(value);
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.detectChanges();
  }

  handleKeyDown(e: KeyboardEvent) {
    if (this.selectionMode() !== 'single' || this.disabled()) return;

    const keys = Array.from(this.buttonElementsMap.keys());
    const currentIndex = keys.indexOf(this.value());
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % keys.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + keys.length) % keys.length;
      e.preventDefault();
    }

    if (nextIndex !== currentIndex) {
      const nextValue = keys[nextIndex];
      this.selectButton(nextValue);
      setTimeout(() => {
        const nextEl = this.buttonElementsMap.get(nextValue);
        nextEl?.focus();
      }, 0);
    }
  }
}
