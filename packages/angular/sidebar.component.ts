import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'sidebar',
  standalone: true,
  template: '<aside [class]="sidebarClass()"><ng-content></ng-content></aside>'
})
export class SidebarComponent {
  collapsed = input<boolean>(false);
  collapsible = input<boolean>(false);

  protected sidebarClass = computed(() => {
    return [
      'sidebar',
      this.collapsed() ? 'sidebar--collapsed' : '',
      this.collapsible() ? 'sidebar--collapsible' : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'sidebar-header',
  standalone: true,
  template: '<div class="sidebar-header"><ng-content></ng-content></div>'
})
export class SidebarHeaderComponent {}

@Component({
  selector: 'sidebar-section',
  standalone: true,
  template: '<div class="sidebar-section"><ng-content></ng-content></div>'
})
export class SidebarSectionComponent {}

@Component({
  selector: 'sidebar-item',
  standalone: true,
  template: `
    <a class="sidebar-item" [attr.data-state]="active() ? 'active' : null">
      @if (icon()) {
        <span class="sidebar-item-icon">{{ icon() }}</span>
      }
      <span class="sidebar-item-label"><ng-content></ng-content></span>
    </a>
  `
})
export class SidebarItemComponent {
  active = input<boolean>(false);
  icon = input<string>('');
}
