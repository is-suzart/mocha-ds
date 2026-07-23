import { Component, input, computed, output, signal } from '@angular/core';

export type DatePickerMode = 'single' | 'range';
export type DatePickerColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

@Component({
  selector: 'date-picker',
  standalone: true,
  template: `
    <div class="datepicker" style="position:relative;display:inline-block">
      <button
        [class]="triggerClass()"
        (click)="toggleOpen()"
        type="button"
        [disabled]="disabled()"
      >
        {{ displayText() }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      @if (isOpen()) {
        <div class="datepicker-popover" style="position:absolute;top:calc(100% + 4px);left:0;z-index:1050">
          <div class="datepicker-header">
            <button (click)="prevMonth()" type="button">&lsaquo;</button>
            <span>{{ MONTHS[viewMonth()] }} {{ viewYear() }}</span>
            <button (click)="nextMonth()" type="button">&rsaquo;</button>
          </div>
          <div class="datepicker-grid">
            @for (day of DAYS; track day) {
              <span class="datepicker-weekday">{{ day }}</span>
            }
          </div>
          <div class="datepicker-grid">
            @for (d of calendarDays(); track $index) {
              @if (d === null) {
                <span class="datepicker-cell"></span>
              } @else {
                <button
                  type="button"
                  class="datepicker-cell"
                  [class.datepicker-cell--selected]="isSelected(d)"
                  (click)="selectDate(d)"
                >
                  {{ d }}
                </button>
              }
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DatePickerComponent {
  value = input<Date | null>(null);
  mode = input<DatePickerMode>('single');
  color = input<DatePickerColor>('mauve');
  disabled = input<boolean>(false);

  valueChange = output<Date | null>();

  protected MONTHS = MONTHS;
  protected DAYS = DAYS;

  isOpen = signal(false);
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());

  protected triggerClass = computed(() => {
    return [
      'datepicker-trigger',
      this.isOpen() ? 'datepicker-trigger--open' : '',
      `datepicker-trigger--${this.color()}`,
    ].filter(Boolean).join(' ');
  });

  protected displayText = computed(() => {
    if (!this.value()) return 'Selecione uma data...';
    const d = this.value()!;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  });

  protected calendarDays = computed(() => {
    return getCalendarDays(this.viewYear(), this.viewMonth());
  });

  isSelected(day: number): boolean {
    if (!this.value()) return false;
    return this.value()!.getDate() === day &&
      this.value()!.getMonth() === this.viewMonth() &&
      this.value()!.getFullYear() === this.viewYear();
  }

  toggleOpen() {
    if (this.disabled()) return;
    this.isOpen.update(v => !v);
    if (this.isOpen() && this.value()) {
      this.viewYear.set(this.value()!.getFullYear());
      this.viewMonth.set(this.value()!.getMonth());
    }
  }

  prevMonth() {
    if (this.viewMonth() === 0) {
      this.viewYear.update(y => y - 1);
      this.viewMonth.set(11);
    } else {
      this.viewMonth.update(m => m - 1);
    }
  }

  nextMonth() {
    if (this.viewMonth() === 11) {
      this.viewYear.update(y => y + 1);
      this.viewMonth.set(0);
    } else {
      this.viewMonth.update(m => m + 1);
    }
  }

  selectDate(day: number) {
    const selected = new Date(this.viewYear(), this.viewMonth(), day);
    this.valueChange.emit(selected);
    this.isOpen.set(false);
  }
}
