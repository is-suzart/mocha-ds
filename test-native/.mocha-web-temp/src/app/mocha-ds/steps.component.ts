import { Component, input, output, computed } from '@angular/core';

type StepsVariant = 'timeline' | 'carousel';
type StepsColor =
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

@Component({
  selector: 'steps',
  standalone: true,
  template: `
    @if (variant() === 'carousel') {
      <div class="steps-carousel" [attr.data-color]="color()">
        @for (i of stepIndexes(); track i) {
          <button
            [class]="'steps-carousel-dot ' + (i === currentStep() ? 'steps-carousel-dot--active' : '')"
            (click)="onStepClick(i)"
            [attr.aria-label]="'Go to step ' + (i + 1)"
          ></button>
        }
      </div>
    }

    @if (variant() === 'timeline') {
      <div
        [class]="'steps-timeline ' + (orientation() === 'vertical' ? 'steps-timeline--vertical' : 'steps-timeline--horizontal') + ' steps--' + color()"
      >
        <div class="steps-track">
          <div
            class="steps-progress"
            [style.width.%]="orientation() === 'horizontal' ? progressWidth() : null"
            [style.height.%]="orientation() === 'vertical' ? progressWidth() : null"
          ></div>
        </div>

        @for (i of stepIndexes(); track i) {
          <button
            [class]="getItemClass(i)"
            (click)="onStepClick(i)"
            [attr.aria-label]="'Step ' + (i + 1)"
          >
            <div class="steps-dot"></div>
            @if (labels() && labels()[i]) {
              <span class="steps-label">{{ labels()[i] }}</span>
            }
          </button>
        }
      </div>
    }
  `
})
export class StepsComponent {
  currentStep = input<number>(0);
  stepsCount = input<number>(0);
  labels = input<string[]>([]);
  variant = input<StepsVariant>('timeline');
  color = input<StepsColor>('mauve');
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  changeStep = output<number>();

  stepIndexes = computed(() => Array.from({ length: this.stepsCount() }, (_, i) => i));

  progressWidth = computed(() => {
    const count = this.stepsCount();
    if (count <= 1) return 0;
    return (this.currentStep() / (count - 1)) * 100;
  });

  onStepClick(index: number): void {
    this.changeStep.emit(index);
  }

  getItemClass(index: number): string {
    const isActive = index === this.currentStep();
    const isCompleted = index < this.currentStep();
    return [
      'steps-item',
      isActive ? 'steps-item--active' : '',
      isCompleted ? 'steps-item--completed' : ''
    ]
      .filter(Boolean)
      .join(' ');
  }
}
