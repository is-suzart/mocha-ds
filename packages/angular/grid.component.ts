import { Component, input, computed } from '@angular/core';

export type GridGap = 0 | 1 | 2 | 3 | 4 | 5;
export type GridAlign = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type GridValign = 'start' | 'center' | 'end';
export type GridColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridOffset = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

@Component({
  selector: 'grid',
  standalone: true,
  template: '<div [class]="gridClass()"><ng-content></ng-content></div>'
})
export class GridComponent {
  mobile = input<boolean>(false);
  multiline = input<boolean>(true);
  gap = input<GridGap>(3);
  align = input<GridAlign | undefined>(undefined);
  valign = input<GridValign | undefined>(undefined);

  protected gridClass = computed(() => {
    return [
      'grid',
      this.mobile() ? 'grid-mobile' : '',
      this.multiline() ? 'grid-multiline' : '',
      `grid-gap-${this.gap()}`,
      this.align() ? `grid-align-${this.align()}` : '',
      this.valign() ? `grid-valign-${this.valign()}` : '',
    ].filter(Boolean).join(' ');
  });
}

@Component({
  selector: 'grid-col',
  standalone: true,
  template: '<div [class]="colClass()"><ng-content></ng-content></div>'
})
export class GridColComponent {
  span = input<GridColSpan>(12);
  offset = input<GridOffset | undefined>(undefined);

  protected colClass = computed(() => {
    return [
      'grid-col',
      `grid-col-${this.span()}`,
      this.offset() ? `grid-col-offset-${this.offset()}` : '',
    ].filter(Boolean).join(' ');
  });
}
