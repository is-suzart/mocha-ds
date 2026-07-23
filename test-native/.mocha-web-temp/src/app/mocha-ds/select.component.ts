import { Component, input, model, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlSize, FormControlShape, FormControlColor } from './form-types';

interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'select[select]',
  standalone: true,
  template: `
    @if (options().length > 0) {
      @for (opt of options(); track opt.value) {
        <option [value]="opt.value">{{ opt.label }}</option>
      }
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class.form-control]': 'true',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.data-state]': 'error() ? "error" : null',
    '[attr.data-color]': 'color()',
    '[disabled]': 'disabled() ? true : null',
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
  size = input<FormControlSize>('md');
  shape = input<FormControlShape>('rounded');
  color = input<FormControlColor>('mauve');
  error = input<boolean>(false);
  disabled = input<boolean>(false);
  options = input<SelectOption[]>([]);

  value = model<any>('');
  change = output<any>();

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(val: any): void { this.value.set(val ?? ''); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this._onChange(val);
    this.change.emit(val);
  }

  onTouchedCallback(): void { this._onTouched(); }
}
