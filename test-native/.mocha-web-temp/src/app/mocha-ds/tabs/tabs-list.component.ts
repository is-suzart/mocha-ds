import { Component, inject, computed } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'tabs-list',
  standalone: true,
  template: `
    <div
      role="tablist"
      [attr.aria-orientation]="parent.orientation()"
      class="tabs-list"
      [attr.data-variant]="parent.variant()"
      (keydown)="handleKeyDown($event)"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabsListComponent {
  parent = inject(TabsComponent);

  handleKeyDown(event: KeyboardEvent) {
    const list = event.currentTarget as HTMLElement;
    const triggers = Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')) as HTMLElement[];
    const activeIndex = triggers.findIndex(el => el.getAttribute('aria-selected') === 'true');

    if (activeIndex === -1) return;

    let nextIndex = activeIndex;
    const isHorizontal = this.parent.orientation() === 'horizontal';

    if (isHorizontal) {
      if (event.key === 'ArrowRight') {
        nextIndex = (activeIndex + 1) % triggers.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
      }
    } else {
      if (event.key === 'ArrowDown') {
        nextIndex = (activeIndex + 1) % triggers.length;
      } else if (event.key === 'ArrowUp') {
        nextIndex = (activeIndex - 1 + triggers.length) % triggers.length;
      }
    }

    if (nextIndex !== activeIndex) {
      event.preventDefault();
      const nextTrigger = triggers[nextIndex];
      nextTrigger.focus();
      nextTrigger.click();
    }
  }
}
