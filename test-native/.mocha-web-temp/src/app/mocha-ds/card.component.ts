import { Component, input } from '@angular/core';

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
  host: {
    '[class.card]': 'true',
    '[attr.data-variant]': 'variant()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-padding]': 'padding()',
    '[attr.data-color]': 'accentColor() || null',
    '[attr.data-accent]': 'accentColor() && accentPosition() !== "none" ? accentPosition() : null',
    '[attr.data-interactive]': 'isInteractive() ? "true" : null',
  },
  template: `<ng-content></ng-content>`
})
export class CardComponent {
  variant = input<CardVariant>('filled');
  shape = input<CardShape>('rounded');
  padding = input<CardPadding>('md');
  accentColor = input<CardAccentColor | undefined>(undefined);
  accentPosition = input<CardAccentPosition>('none');
  isInteractive = input<boolean>(false);
}

@Component({
  selector: 'header[card-header]',
  standalone: true,
  host: {
    '[class.card-header]': 'true',
  },
  template: `
    @if (hasAvatar()) {
      <div class="card-avatar">
        <ng-content select="[avatar]"></ng-content>
      </div>
    }
    @if (title() || subtitle()) {
      <div class="card-header-content">
        @if (title()) {
          <h3 class="card-title">{{ title() }}</h3>
        }
        @if (subtitle()) {
          <p class="card-subtitle">{{ subtitle() }}</p>
        }
        <ng-content select="[header-content]"></ng-content>
      </div>
    }
    <ng-content></ng-content>
    <div class="card-actions">
      <ng-content select="[actions]"></ng-content>
    </div>
  `
})
export class CardHeaderComponent {
  title = input<string>('');
  subtitle = input<string>('');
  hasAvatar = input<boolean>(false);
}

@Component({
  selector: 'card-body, [card-body]',
  standalone: true,
  host: {
    '[class.card-body]': 'true',
  },
  template: `<ng-content></ng-content>`
})
export class CardBodyComponent {}

@Component({
  selector: 'card-footer, [card-footer]',
  standalone: true,
  host: {
    '[class.card-footer]': 'true',
  },
  template: `<ng-content></ng-content>`
})
export class CardFooterComponent {}

@Component({
  selector: 'card-media, [card-media]',
  standalone: true,
  host: {
    '[class.card-media]': 'true',
  },
  template: `
    @if (src()) {
      <img [src]="src()" [alt]="alt()" />
    } @else {
      <ng-content></ng-content>
    }
  `
})
export class CardMediaComponent {
  src = input<string | undefined>(undefined);
  alt = input<string>('');
}
