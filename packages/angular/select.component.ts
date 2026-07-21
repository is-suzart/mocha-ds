import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlSize, FormControlShape, FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'select[select]',
  standalone: true,
  template: '<ng-content></ng-content>',
  host: {
    '[class]': 'hostClass()',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-state]': "error() ? 'error' : null",
    '[attr.data-color]': 'color()',
    '(change)': 'onSelectChange($event)',
    '(blur)': 'onTouchedCallback()',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
})
export class SelectComponent implements ControlValueAccessor {
  value = model<any>('');
  size = input<FormControlSize>('md');
  shape = input<FormControlShape>('rounded');
  color = input<FormControlColor>('mauve');
  error = input<boolean>(false);

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  hostClass = computed(() => 'form-control');

  writeValue(val: any): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this._onChange(val);
  }

  onTouchedCallback(): void { this._onTouched(); }
}
