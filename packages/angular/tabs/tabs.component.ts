import { Component, input, computed, output, signal, inject, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsMode = 'state' | 'router';
export type TabColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

@Component({
  selector: 'tabs',
  standalone: true,
  template: `
    <div class="tabs" [attr.data-orientation]="orientation()" [attr.data-color]="color()">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent {
  value = input<string>('');
  variant = input<TabsVariant>('default');
  size = input<string>('md');
  color = input<TabColor>('mauve');
  orientation = input<TabsOrientation>('horizontal');
  mode = input<TabsMode>('state');

  valueChange = output<string>();

  private router = inject<Router | null>(Router as any, { optional: true });
  private route = inject<ActivatedRoute | null>(ActivatedRoute as any, { optional: true });

  activeValue = signal<string>('');

  selectTab(val: string) {
    this.activeValue.set(val);
    this.valueChange.emit(val);

    if (this.mode() === 'router' && this.router) {
      this.router.navigate([val], { relativeTo: this.route || undefined });
    }
  }

  isSelected(val: string): boolean {
    if (this.mode() === 'router' && this.route) {
      return this.route.snapshot.url.map(s => s.path).includes(val);
    }
    return this.activeValue() === val;
  }
}
