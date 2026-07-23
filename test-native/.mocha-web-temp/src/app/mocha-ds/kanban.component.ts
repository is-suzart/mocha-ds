import { Component, input, computed, output, signal } from '@angular/core';

export interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
}

export interface KanbanItem {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

@Component({
  selector: 'kanban',
  standalone: true,
  template: `
    <div [class]="'pro-kanban-board pro-kanban-board--' + color() + ' ' + className()">
      @for (column of columns(); track column.id) {
        <div
          [class]="'pro-kanban-column pro-kanban-column--' + (column.color || color())"
          (dragover)="$event.preventDefault()"
          (drop)="onDropColumn($event, column.id)"
        >
          @if (renderColumnHeader()) {
            <div [innerHTML]="renderColumnHeader()!(column, getColumnItems(column.id))"></div>
          } @else {
            <div class="pro-kanban-column-header">
              <div class="pro-kanban-column-title-container">
                <span class="pro-kanban-column-dot"></span>
                <h3 class="pro-kanban-column-title">{{ column.title }}</h3>
              </div>
              <span class="pro-kanban-column-badge">{{ getColumnItems(column.id).length }}</span>
            </div>
          }

          <div class="pro-kanban-cards-container">
            @for (item of getColumnItems(column.id); track item.id) {
              <div
                draggable="true"
                (dragstart)="onDragStart($event, item)"
                (dragend)="onDragEnd()"
                (dragover)="$event.preventDefault()"
                (dragenter)="onDragEnterCard($event, item)"
                [class.pro-kanban-card--dragging]="draggedItem()?.id === item.id"
                class="pro-kanban-card"
                (click)="handleCardClick(item)"
              >
                @if (renderItem()) {
                  <div [innerHTML]="renderItem()!(item)"></div>
                } @else {
                  <div class="pro-kanban-card-title">{{ item.title }}</div>
                  @if (item.description) {
                    <div class="pro-kanban-card-desc">{{ item.description }}</div>
                  }
                  @if (item.tags && item.tags.length > 0) {
                    <div class="pro-kanban-card-tags">
                      @for (tag of item.tags; track tag) {
                        <span class="pro-kanban-card-tag">{{ tag }}</span>
                      }
                    </div>
                  }
                }
              </div>
            }

            @if (getColumnItems(column.id).length === 0) {
              <div class="pro-kanban-empty-column-placeholder">
                Solte itens aqui
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class KanbanComponent {
  columns = input<KanbanColumn[]>([]);
  items = input<KanbanItem[]>([]);
  color = input<string>('mauve');
  className = input<string>('');
  renderItem = input<((item: KanbanItem) => any) | undefined>(undefined);
  renderColumnHeader = input<((column: KanbanColumn, columnItems: KanbanItem[]) => any) | undefined>(undefined);

  itemsChange = output<KanbanItem[]>();
  itemClick = output<KanbanItem>();

  protected draggedItem = signal<KanbanItem | null>(null);

  protected getColumnItems(columnId: string): KanbanItem[] {
    return this.items().filter(item => item.columnId === columnId);
  }

  protected onDragStart(event: DragEvent, item: KanbanItem): void {
    this.draggedItem.set(item);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
    }
  }

  protected onDragEnd(): void {
    this.draggedItem.set(null);
  }

  protected onDragEnterCard(event: DragEvent, targetItem: KanbanItem): void {
    const dragged = this.draggedItem();
    if (!dragged || dragged.id === targetItem.id) return;

    const currentItems = [...this.items()];
    const activeIndex = currentItems.findIndex(i => i.id === dragged.id);
    const targetIndex = currentItems.findIndex(i => i.id === targetItem.id);

    if (activeIndex !== -1 && targetIndex !== -1) {
      const updatedDragged = { ...dragged, columnId: targetItem.columnId };
      currentItems.splice(activeIndex, 1);
      currentItems.splice(targetIndex, 0, updatedDragged);
      this.itemsChange.emit(currentItems);
      this.draggedItem.set(updatedDragged);
    }
  }

  protected onDropColumn(event: DragEvent, columnId: string): void {
    const dragged = this.draggedItem();
    if (!dragged) return;

    const currentItems = [...this.items()];
    const activeIndex = currentItems.findIndex(i => i.id === dragged.id);

    if (activeIndex !== -1) {
      const item = currentItems[activeIndex];
      if (item.columnId !== columnId) {
        currentItems.splice(activeIndex, 1);
        currentItems.push({ ...item, columnId });
        this.itemsChange.emit(currentItems);
      }
    }
    this.draggedItem.set(null);
  }

  protected handleCardClick(item: KanbanItem): void {
    this.itemClick.emit(item);
  }
}
