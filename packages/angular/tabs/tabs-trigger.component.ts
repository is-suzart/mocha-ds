import { Component, input, computed, inject } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'tabs-trigger',
  standalone: true,
  template: `
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="isSelected()"
      [attr.aria-controls]="'tabpanel-' + value()"
      [id]="'tabtrigger-' + value()"
      [attr.data-value]="value()"
      [attr.tabindex]="isSelected() ? 0 : -1"
      [disabled]="disabled()"
      class="tabs-trigger"
      [attr.data-variant]="parent.variant()"
      [attr.data-size]="parent.size()"
      [attr.data-state]="isSelected() ? 'active' : null"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class TabsTriggerComponent {
  value = input.required<string>();
  disabled = input<boolean>(false);
  routerLink = input<string>('');

  parent = inject(TabsComponent);

  isSelected = computed(() => this.parent.isSelected(this.value()));

  handleClick() {
    if (this.disabled()) return;
    this.parent.selectTab(this.value());
  }
}
