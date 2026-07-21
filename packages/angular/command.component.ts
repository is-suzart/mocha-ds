import { Component, input, output, signal, computed, effect, HostListener, ViewChild, ElementRef } from '@angular/core';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  onSelect?: () => void;
}

@Component({
  selector: 'command',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="command-overlay" (click)="onOverlayClick($event)" role="dialog" aria-modal="true" aria-label="Command palette">
        <div class="command">
          <div class="command-input-wrapper">
            <svg class="command-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              #inputEl
              class="command-input"
              [placeholder]="placeholder()"
              (input)="onInput($event)"
              (keydown)="onKeyDown($event)"
            />
          </div>
          <div class="command-list">
            @if (flatFiltered().length === 0) {
              <div class="command-empty">{{ emptyMessage() }}</div>
            } @else {
              @for (group of groupKeys(); track group) {
                <div>
                  <div class="command-group-label">{{ group }}</div>
                  @for (item of grouped()[group]; track item.id) {
                    <div
                      class="command-item" [attr.data-state]="flatFiltered().indexOf(item) === selectedIndex() ? 'selected' : null"
                      (click)="selectItem(item)"
                      (mouseenter)="selectedIndex.set(flatFiltered().indexOf(item))"
                    >
                      <span class="command-item-label">{{ item.label }}</span>
                      @if (item.shortcut) {
                        <span class="command-item-shortcut">{{ item.shortcut }}</span>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    }
  `
})
export class CommandComponent {
  items = input<CommandItem[]>([]);
  open = input<boolean>(false);
  placeholder = input<string>('Search commands...');
  emptyMessage = input<string>('No results found.');

  openChange = output<boolean>();

  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;

  query = signal('');
  selectedIndex = signal(0);

  isOpen = signal(false);

  private internalOpen = false;

  constructor() {
    effect(() => {
      const controlled = this.open();
      if (this.internalOpen !== controlled) {
        this.internalOpen = controlled;
        this.isOpen.set(controlled);
        if (controlled) {
          this.query.set('');
          this.selectedIndex.set(0);
          setTimeout(() => this.inputEl?.nativeElement?.focus(), 50);
        }
      }
    });
  }

  filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.items().filter(item => item.label.toLowerCase().includes(q));
  });

  grouped = computed(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of this.filtered()) {
      const g = item.group || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    }
    return groups;
  });

  groupKeys = computed(() => Object.keys(this.grouped()));
  flatFiltered = computed(() => this.filtered());

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.toggle();
    }
    if (e.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  toggle(): void {
    const next = !this.isOpen();
    this.internalOpen = next;
    this.isOpen.set(next);
    this.openChange.emit(next);
    if (next) {
      this.query.set('');
      this.selectedIndex.set(0);
    }
  }

  close(): void {
    this.internalOpen = false;
    this.isOpen.set(false);
    this.openChange.emit(false);
  }

  onInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
    this.selectedIndex.set(0);
  }

  onKeyDown(e: KeyboardEvent): void {
    const flat = this.flatFiltered();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex.update(i => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex.update(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flat[this.selectedIndex()]) {
      flat[this.selectedIndex()].onSelect?.();
      this.close();
    }
  }

  selectItem(item: CommandItem): void {
    item.onSelect?.();
    this.close();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('command-overlay')) {
      this.close();
    }
  }
}
