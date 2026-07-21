import { Component, input, computed, model, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlColor, getFormThemeClass } from './form-types';

@Component({
  selector: 'slider',
  standalone: true,
  template: `
    <div class="slider-container" [attr.data-color]="color()">
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [value]="value()"
        [disabled]="disabled()"
        class="slider"
        (input)="onSliderInput($event)"
        (blur)="onTouchedCallback()"
      />
      @if (showValue()) {
        <span class="slider-value">{{ value() }}</span>
      }
    </div>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true,
  }],
})
export class SliderComponent implements ControlValueAccessor {
  value = model<number>(50);
  min = input<number>(0);
  max = input<number>(100);
  color = input<FormControlColor>('mauve');
  showValue = input<boolean>(true);
  disabled = input<boolean>(false);

  private _onChange: (val: any) => void = () => {};
  private _onTouched: () => void = () => {};



  writeValue(val: any): void { this.value.set(Number(val) || 0); }
  registerOnChange(fn: any): void { this._onChange = fn; }
  registerOnTouched(fn: any): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {}

  onSliderInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
    this._onChange(val);
  }

  onTouchedCallback(): void { this._onTouched(); }
}
