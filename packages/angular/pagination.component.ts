import { Component, input, computed, output } from '@angular/core';

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationShape = 'square' | 'rounded' | 'pill';
export type PaginationColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

export const DOTS = '...';

@Component({
  selector: 'pagination',
  standalone: true,
  template: `
    <nav [class]="containerClass()" aria-label="Pagination">
      <button
        class="pagination-item"
        [class]="'pagination-item--' + size()"
        [disabled]="currentPage() <= 1"
        (click)="goTo(currentPage() - 1)"
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      @for (item of range(); track $index) {
        @if (item === DOTS) {
          <span class="pagination-ellipsis">{{ DOTS }}</span>
        } @else {
          <button
            class="pagination-item"
            [class]="'pagination-item--' + size()"
            [class.pagination-item--active]="item === currentPage()"
            (click)="goTo(Number(item))"
            [attr.aria-current]="item === currentPage() ? 'page' : null"
          >
            {{ item }}
          </button>
        }
      }

      <button
        class="pagination-item"
        [class]="'pagination-item--' + size()"
        [disabled]="currentPage() >= totalPages()"
        (click)="goTo(currentPage() + 1)"
        aria-label="Next page"
      >
        &rsaquo;
      </button>
    </nav>
  `
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalPages = input<number>(1);
  siblingCount = input<number>(1);
  size = input<PaginationSize>('md');
  shape = input<PaginationShape>('rounded');
  color = input<PaginationColor>('mauve');

  pageChange = output<number>();

  protected range = computed(() => this.getRange());

  protected containerClass = computed(() => {
    return [
      'pagination',
      `pagination--${this.size()}`,
      `pagination--${this.shape()}`,
      `pagination--${this.color()}`,
    ].filter(Boolean).join(' ');
  });

  private getRange(): (number | string)[] {
    const current = this.currentPage();
    const total = this.totalPages();
    const siblings = this.siblingCount();
    const totalPageNumbers = siblings * 2 + 5;

    if (totalPageNumbers >= total) {
      return Array.from({ length: Math.max(total, 1) }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, total);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 2;

    if (!showLeftDots && showRightDots) {
      const leftCount = 3 + 2 * siblings;
      const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, total];
    }

    if (showLeftDots && !showRightDots) {
      const rightCount = 3 + 2 * siblings;
      const rightRange = Array.from(
        { length: rightCount },
        (_, i) => total - rightCount + i + 1
      );
      return [1, DOTS, ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSibling - leftSibling + 1 },
      (_, i) => leftSibling + i
    );
    return [1, DOTS, ...middleRange, DOTS, total];
  }

  goTo(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }
}
