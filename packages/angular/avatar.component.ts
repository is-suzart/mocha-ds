import { Component, input, signal } from '@angular/core';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'avatar',
  standalone: true,
  template: `
    <div class="avatar" [attr.data-size]="size()" [attr.aria-label]="alt() || fallback() || 'Avatar'">
      @if (src() && !imgError()) {
        <img [src]="src()" [alt]="alt()" (error)="onError()" />
      } @else {
        <span class="avatar-fallback">{{ initials() }}</span>
      }
    </div>
  `
})
export class AvatarComponent {
  src = input<string>('');
  alt = input<string>('');
  fallback = input<string>('');
  size = input<AvatarSize>('md');

  private imgHasError = signal(false);

  imgError = this.imgHasError.asReadonly();

  initials(): string {
    const fb = this.fallback();
    if (!fb) return '?';
    if (fb.length <= 2) return fb;
    return fb
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  onError(): void {
    this.imgHasError.set(true);
  }
}

@Component({
  selector: 'avatar-group',
  standalone: true,
  template: `
    <div class="avatar-group" [attr.data-size]="size()">
      @for (item of visibleItems; track item) {
        <ng-content select="avatar" />
      }
      @if (remaining > 0) {
        <span class="avatar-group-more" [style]="moreStyle">
          +{{ remaining }}
        </span>
      }
    </div>
  `
})
export class AvatarGroupComponent {
  size = input<AvatarSize>('md');
  max = input<number | undefined>(undefined);
  remaining = 0;

  get visibleItems(): number[] {
    return [];
  }

  get moreStyle(): Record<string, string> {
    const s = this.size();
    const px = s === 'sm' ? '28px' : s === 'lg' ? '48px' : '36px';
    return { width: px, height: px };
  }
}
