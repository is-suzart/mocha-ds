import { Component, input, computed } from '@angular/core';

export type ShellLayout = 'header-first' | 'sidebar-first' | 'simple' | 'custom';

@Component({
  selector: 'shell',
  standalone: true,
  template: '<div [class]="shellClass()"><ng-content></ng-content></div>'
})
export class ShellComponent {
  layout = input<ShellLayout>('header-first');
  fullScreen = input<boolean>(true);

  protected shellClass = computed(() => {
    return [
      'shell',
      `shell--${this.layout()}`,
      this.fullScreen() ? 'shell--full-screen' : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'shell-header',
  standalone: true,
  template: '<div class="shell-header"><ng-content></ng-content></div>'
})
export class ShellHeaderComponent {}

@Component({
  selector: 'shell-sidebar',
  standalone: true,
  template: '<div class="shell-sidebar"><ng-content></ng-content></div>'
})
export class ShellSidebarComponent {}

@Component({
  selector: 'shell-main',
  standalone: true,
  template: '<div class="shell-main"><ng-content></ng-content></div>'
})
export class ShellMainComponent {}

@Component({
  selector: 'shell-content',
  standalone: true,
  template: '<div [class]="contentClass()"><ng-content></ng-content></div>'
})
export class ShellContentComponent {
  scrollable = input<boolean>(false);

  protected contentClass = computed(() => {
    return [
      'shell-content',
      ,
    ].filter(Boolean).join(' ');
  });
}
