import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'radio-group',
  standalone: true,
  template: `
    <div [class]="'radio-group'" role="radiogroup">
      @for (opt of options(); track opt.value) {
        <label class="radio-item" [attr.data-state]="disabled() ? 'disabled' : null" [attr.data-color]="color()">
          <input
            type="radio"
            [name]="name()"
            [value]="opt.value"
            [checked]="value() === opt.value"
            [disabled]="disabled()"
            (change)="onSelect(opt.value)"
          />
          <span class="radio-circle">
            <span class="radio-dot"></span>
          </span>
          <span>{{ opt.label }}</span>
        </label>
      }
    </div>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true,
  }],
})
export class RadioGroupComponent implements ControlValueAccessor {
  value = model<any>(null);
  name = input.required<string>();
  options = input<{ label: string; value: any }[]>([]);
  color = input<FormControlColor>('mauve');
  disabled = input<boolean>(false);

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};



  writeValue(val: any): void { this.value.set(val); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onSelect(val: any): void {
    this.value.set(val);
    this._onChange(val);
    this._onTouched();
  }
}
