import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'form-group',
  standalone: true,
  template: `
    <div [class]="'form-group'">
      @if (label()) {
        <label [for]="htmlFor()" class="form-group-label">
          {{ label() }}
          @if (required()) {
            <span class="form-group-required-indicator" aria-hidden="true">*</span>
          }
        </label>
      }
      <ng-content></ng-content>
      @if (error()) {
        <span class="form-group-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style="flex-shrink:0">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ error() }}
        </span>
      } @else if (description()) {
        <span class="form-group-description">{{ description() }}</span>
      }
    </div>
  `
})
export class FormGroupComponent {
  label = input<string>('');
  description = input<string>('');
  error = input<string>('');
  required = input<boolean>(false);
  htmlFor = input<string>('');
}
