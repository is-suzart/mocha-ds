import { Component, input, output, signal, computed, HostListener, effect } from '@angular/core';

@Component({
  selector: 'carousel',
  standalone: true,
  template: `
    <div class="carousel" role="region" aria-label="Carousel">
      <div class="carousel-viewport">
        <div class="carousel-track" [style.transform]="'translateX(-' + current() * 100 + '%)'">
          @for (slide of slides; track $index) {
            <div class="carousel-slide" role="group" aria-roledescription="slide" [attr.aria-label]="'Slide ' + ($index + 1) + ' of ' + slides.length">
              <ng-content />
            </div>
          }
        </div>
      </div>
      @if (showArrows() && slides.length > 1) {
        <button class="carousel-btn carousel-btn" data-state="prev" (click)="prev()" [disabled]="current() === 0" aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="carousel-btn carousel-btn" data-state="next" (click)="next()" [disabled]="current() === slides.length - 1" aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      }
      @if (showDots() && slides.length > 1) {
        <div class="carousel-dots" role="tablist" aria-label="Slides">
          @for (dot of slides; track $index) {
            <button
              class="carousel-dot" [attr.data-state]="$index === current() ? 'active' : null"
              (click)="goTo($index)"
              role="tab"
              [attr.aria-selected]="$index === current()"
              [attr.aria-label]="'Go to slide ' + ($index + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `
})
export class CarouselComponent {
  showArrows = input<boolean>(true);
  showDots = input<boolean>(true);
  autoPlay = input<boolean>(false);
  autoPlayInterval = input<number>(4000);

  current = signal(0);
  slides: number[] = [0];

  private intervalId: any = null;

  constructor() {
    effect(() => {
      if (this.autoPlay() && this.slides.length > 1) {
        this.intervalId = setInterval(() => this.next(), this.autoPlayInterval());
        return () => { if (this.intervalId) clearInterval(this.intervalId); };
      }
    });
  }

  goTo(index: number): void {
    const max = this.slides.length - 1;
    this.current.set(Math.max(0, Math.min(index, max)));
  }

  prev(): void { this.goTo(this.current() - 1); }
  next(): void { this.goTo(this.current() + 1); }
}
