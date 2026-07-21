import { Component, input, output, computed, inject } from '@angular/core';

export type DropdownColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

@Component({
  selector: 'dropdown',
  standalone: true,
  template: `
    <div class="dropdown-wrapper" style="position:relative;display:inline-block">
      <ng-content select="[trigger]"></ng-content>
      @if (isOpen()) {
        <div
          class="dropdown-menu"
          [style.position]="'absolute'"
          [style.zIndex]="'1050'"
          role="menu"
        >
          <ng-content></ng-content>
        </div>
      }
    </div>
  `
})
export class DropdownComponent {
  isOpen = input<boolean>(false);
  color = input<DropdownColor>('mauve');

  isOpenChange = output<boolean>();

  toggle() {
    this.isOpenChange.emit(!this.isOpen());
  }

  close() {
    this.isOpenChange.emit(false);
  }
}

@Component({
  selector: 'dropdown-item',
  standalone: true,
  template: `
    <button
      type="button"
      class="dropdown-item"
      [attr.data-color]="danger() ? 'danger' : color()"
      [attr.data-state]="disabled() ? 'disabled' : null"
      [disabled]="disabled()"
      role="menuitem"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class DropdownItemComponent {
  disabled = input<boolean>(false);
  danger = input<boolean>(false);
  color = input<DropdownColor>('mauve');

  parent = inject(DropdownComponent, { optional: true });

  handleClick() {
    if (this.disabled()) return;
    if (this.parent) this.parent.close();
  }
}

@Component({
  selector: 'dropdown-divider',
  standalone: true,
  template: '<div class="dropdown-divider" role="separator"></div>'
})
export class DropdownDividerComponent {}

@Component({
  selector: 'dropdown-header',
  standalone: true,
  template: '<div class="dropdown-header"><ng-content></ng-content></div>'
})
export class DropdownHeaderComponent {}
