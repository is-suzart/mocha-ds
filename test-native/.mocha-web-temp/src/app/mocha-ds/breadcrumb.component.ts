import { Component, input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'breadcrumb',
  standalone: true,
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      @for (item of items(); track $index) {
        @if (!$first) {
          <span class="breadcrumb-separator" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </span>
        }
        @if (item.href && !$last) {
          <a [href]="item.href" class="breadcrumb-item">{{ item.label }}</a>
        } @else {
          <span
            class="breadcrumb-item{{ $last ? ' breadcrumb-item--active' : '' }}"
            [attr.aria-current]="$last ? 'page' : undefined"
          >
            {{ item.label }}
          </span>
        }
      }
    </nav>
  `
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
