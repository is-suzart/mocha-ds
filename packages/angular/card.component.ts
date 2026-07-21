import { Component, input, computed } from '@angular/core';

export type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
export type CardShape = 'square' | 'rounded' | 'pill';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardAccentColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';
export type CardAccentPosition = 'top' | 'left' | 'none';

@Component({
  selector: 'card',
  standalone: true,
  template: `
    <div
      [class]="cardClass()"
      [attr.data-variant]="variant()"
      [attr.data-shape]="shape()"
      [attr.data-padding]="padding()"
      [attr.data-color]="accentColor() || null"
      [attr.data-accent]="accentColor() && accentPosition() !== 'none' ? accentPosition() : null"
      [attr.data-interactive]="isInteractive() ? 'true' : null"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  variant = input<CardVariant>('filled');
  shape = input<CardShape>('rounded');
  padding = input<CardPadding>('md');
  accentColor = input<CardAccentColor | undefined>(undefined);
  accentPosition = input<CardAccentPosition>('none');
  isInteractive = input<boolean>(false);

  cardClass = computed(() => {
    return 'card';
  });
}

@Component({
  selector: 'card-header',
  standalone: true,
  template: `
    <div class="card-header">
      @if (hasAvatar()) {
        <div class="card-avatar">
          <ng-content select="[avatar]"></ng-content>
        </div>
      }
      <div class="card-header-content">
        @if (title()) {
          <h3 class="card-title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="card-subtitle">{{ subtitle() }}</p>
        }
        <ng-content select="[header-content]"></ng-content>
      </div>
      <div class="card-actions">
        <ng-content select="[actions]"></ng-content>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  title = input<string | undefined>(undefined);
  subtitle = input<string | undefined>(undefined);
  hasAvatar = input<boolean>(false);
}

@Component({
  selector: 'card-body',
  standalone: true,
  template: `
    <div class="card-body">
      <ng-content></ng-content>
    </div>
  `
})
export class CardBodyComponent {}

@Component({
  selector: 'card-footer',
  standalone: true,
  template: `
    <div class="card-footer">
      <ng-content></ng-content>
    </div>
  `
})
export class CardFooterComponent {}

@Component({
  selector: 'card-media',
  standalone: true,
  template: `
    <div class="card-media">
      @if (src()) {
        <img [src]="src()" [alt]="alt()" />
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `
})
export class CardMediaComponent {
  src = input<string | undefined>(undefined);
  alt = input<string>('');
}
