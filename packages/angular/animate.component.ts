import {
  Component,
  input,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  signal,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AnimationName =
  | 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'scale-in' | 'slide-up' | 'slide-down' | 'blur-in' | 'bounce-in'
  | 'spin' | 'pulse';

export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';

export type AnimationEasing = 'out' | 'in-out' | 'spring';

@Component({
  selector: 'animate',
  standalone: true,
  template: `
    <div #container [class]="animClass()" [style]="animStyle()">
      <ng-content />
    </div>
  `,
})
export class AnimateComponent implements AfterViewInit, OnDestroy {
  animation = input<AnimationName>('fade-up');
  duration = input<AnimationDuration>('normal');
  delay = input<number>(0);
  easing = input<AnimationEasing>('out');
  once = input<boolean>(true);
  threshold = input<number>(0.2);

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private visible = signal(false);
  private observer: IntersectionObserver | null = null;
  private platformId = inject(PLATFORM_ID);

  animClass = computed(() => {
    const parts = [
      `anim--${this.animation()}`,
      this.duration() !== 'normal' ? `anim--duration-${this.duration()}` : '',
      this.easing() !== 'out' ? `anim--ease-${this.easing()}` : '',
    ];
    return parts.filter(Boolean).join(' ');
  });

  animStyle = computed(() => {
    const style: Record<string, string | null> = {};
    if (this.delay() > 0) style['--ctp-anim-delay'] = `${this.delay()}ms`;
    if (!this.visible()) style['animationPlayState'] = 'paused';
    return style;
  });

  ngAfterViewInit(): void {
    this.createObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private createObserver(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      this.visible.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.visible.set(true);
          if (this.once()) this.observer?.unobserve(this.containerRef.nativeElement);
        } else if (!this.once()) {
          this.visible.set(false);
        }
      },
      { threshold: this.threshold() },
    );
    this.observer.observe(this.containerRef.nativeElement);
  }
}
