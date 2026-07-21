import { Component, input, computed } from '@angular/core';

type ButtonColor =
  | 'rosewater'
  | 'flamingo'
  | 'pink'
  | 'mauve'
  | 'red'
  | 'maroon'
  | 'peach'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'sky'
  | 'sapphire'
  | 'blue'
  | 'lavender';

export interface StepItem {
  label: string;
  description?: string;
  icon?: string;
}

@Component({
  selector: 'stepper',
  standalone: true,
  template: `
    <div
      class="stepper-wrapper stepper"
      [attr.data-orientation]="orientation()"
      [attr.data-state]="variant()"
      [attr.data-color]="color()"
      [style]="cssStyle()"
    >
      <!-- Background line track -->
      <div class="stepper-track">
        <div class="stepper-track-active"></div>
      </div>

      <!-- Steps -->
      @for (step of steps(); track $index) {
        <div class="stepper-step" [attr.data-state]="getStepStatus($index)">
          <!-- Step node icon / dot / number -->
          <div class="stepper-node">
            @if (variant() !== 'dots') {
              @if ($index < currentStep()) {
                <!-- Completed check icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.1em; height: 1.1em">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              } @else if ((variant() === 'icon' || variant() === 'labeled-icon') && step.icon) {
                <span>{{ step.icon }}</span>
              } @else {
                <span>{{ $index + 1 }}</span>
              }
            }
          </div>

          <!-- Vertical track segment inside step item for vertical layout styling -->
          @if (orientation() === 'vertical' && $index < steps().length - 1) {
            <div class="stepper-track">
              <div 
                class="stepper-track-active"
                [style.height]="$index < currentStep() ? '100%' : $index === currentStep() ? '50%' : '0%'"
              ></div>
            </div>
          }

          <!-- Labels -->
          @if (!(variant() === 'dots' && orientation() === 'horizontal')) {
            <div class="stepper-label-group">
              <h4 class="stepper-title">{{ step.label }}</h4>
              @if (step.description) {
                <p class="stepper-description">{{ step.description }}</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class StepperComponent {
  steps = input<StepItem[]>([]);
  currentStep = input<number>(0);
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  variant = input<'default' | 'dots' | 'icon' | 'labeled-icon'>('default');
  color = input<ButtonColor>('mauve');

  segments = computed(() => Math.max(1, this.steps().length - 1));

  progressPercent = computed(() => {
    return Math.min(100, Math.max(0, (this.currentStep() / this.segments()) * 100));
  });

  cssStyle = computed(() => {
    return {
      '--ctp-total-steps': String(this.steps().length),
      '--ctp-stepper-progress': `${this.progressPercent()}%`,
    };
  });

  getStepStatus(index: number): string {
    let status = 'upcoming';
    if (index < this.currentStep()) {
      status = 'completed';
    } else if (index === this.currentStep()) {
      status = 'active';
    }
    return status;
  }
}
