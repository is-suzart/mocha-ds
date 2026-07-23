import { Component, input, model, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlColor } from './form-types';

@Component({
  selector: 'switch',
  standalone: true,
  template: `
    <label
      class="switch-row"
      [attr.data-state]="disabled() ? 'disabled' : null"
      [attr.data-color]="color()"
    >
      <input
        type="checkbox"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="onToggle()"
      />
      <span class="switch-track">
        <span class="switch-thumb"></span>
      </span>
      <span>{{ label() }}</span>
    </label>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true,
  }],
})
export class SwitchComponent implements ControlValueAccessor {
  label = input.required<string>();
  color = input<FormControlColor>('mauve');
  disabled = input<boolean>(false);

  checked = model<boolean>(false);
  change = output<boolean>();

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
    this.change.emit(next);
  }
}
