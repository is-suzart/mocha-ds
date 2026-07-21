import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'checkbox',
  standalone: true,
  template: `
    <label class="checkbox-row" [attr.data-state]="disabled() ? 'disabled' : null" [attr.data-color]="color()">
      <input
        type="checkbox"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="onToggle()"
      />
      <span class="checkbox-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span>{{ label() }}</span>
    </label>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
})
export class CheckboxComponent implements ControlValueAccessor {
  checked = model<boolean>(false);
  label = input.required<string>();
  disabled = input<boolean>(false);
  color = input<FormControlColor>('mauve');

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};



  writeValue(val: any): void { this.checked.set(!!val); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onToggle(): void {
    const next = !this.checked();
    this.checked.set(next);
    this._onChange(next);
    this._onTouched();
  }
}
