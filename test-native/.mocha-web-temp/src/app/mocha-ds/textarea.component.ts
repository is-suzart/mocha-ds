import { Component, input, model, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlSize, FormControlColor } from './form-types';

@Component({
  selector: 'textarea[textarea]',
  standalone: true,
  template: '',
  host: {
    '[class.form-control]': 'true',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-state]': 'error() ? "error" : null',
    '[attr.data-color]': 'color()',
    '[disabled]': 'disabled() ? true : null',
    '[placeholder]': 'placeholder()',
    '(input)': 'onInputChange($event)',
    '(blur)': 'onTouchedCallback()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextAreaComponent),
    multi: true,
  }],
})
export class TextAreaComponent implements ControlValueAccessor {
  size = input<FormControlSize>('md');
  shape = input<'square' | 'rounded'>('rounded');
  color = input<FormControlColor>('mauve');
  error = input<boolean>(false);
  disabled = input<boolean>(false);
  placeholder = input<string>('');

  value = model<string>('');
  change = output<string>();

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(val: any): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onInputChange(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this._onChange(val);
    this.change.emit(val);
  }

  onTouchedCallback(): void { this._onTouched(); }
}
