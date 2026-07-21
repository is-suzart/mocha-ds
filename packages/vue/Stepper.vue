<template>
  <div
    class="stepper-wrapper stepper"
    :data-orientation="orientation"
    :data-state="variant"
    :data-color="color"
    :style="cssStyle"
  >
    <!-- Background line track -->
    <div class="stepper-track">
      <div class="stepper-track-active"></div>
    </div>

    <!-- Steps -->
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="stepper-step"
      :data-state="getStepStatus(index)"
    >
      <!-- Step node icon / dot / number -->
      <div class="stepper-node">
        <template v-if="variant !== 'dots'">
          <!-- Completed checkmark icon -->
          <svg v-if="index < currentStep" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <!-- Custom icon if slot or prop is set -->
          <component 
            v-else-if="(variant === 'icon' || variant === 'labeled-icon') && step.icon" 
            :is="step.icon" 
          />
          <!-- Fallback numeric index -->
          <span v-else>{{ index + 1 }}</span>
        </template>
      </div>

      <!-- Vertical track segment inside step item for vertical layout styling -->
      <div 
        v-if="orientation === 'vertical' && index < steps.length - 1" 
        class="stepper-track"
      >
        <div 
          class="stepper-track-active"
          :style="{
            height: index < currentStep ? '100%' : index === currentStep ? '50%' : '0%'
          }"
        ></div>
      </div>

      <!-- Labels (hidden on dots horizontal) -->
      <div 
        v-if="!(variant === 'dots' && orientation === 'horizontal')" 
        class="stepper-label-group"
      >
        <h4 class="stepper-title">{{ step.label }}</h4>
        <p v-if="step.description" class="stepper-description">
          {{ step.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

interface StepItem {
  label: string;
  description?: string;
  icon?: any;
}

interface Props {
  steps: StepItem[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dots' | 'icon' | 'labeled-icon';
  color?: ButtonColor;
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  variant: 'default',
  color: 'mauve',
});

const segments = computed(() => Math.max(1, props.steps.length - 1));
const progressPercent = computed(() => {
  return Math.min(100, Math.max(0, (props.currentStep / segments.value) * 100));
});

const cssStyle = computed(() => {
  return {
    '--ctp-total-steps': props.steps.length,
    '--ctp-stepper-progress': `${progressPercent.value}%`,
  };
});

function getStepStatus(index: number) {
  let status = 'upcoming';
  if (index < props.currentStep) {
    status = 'completed';
  } else if (index === props.currentStep) {
    status = 'active';
  }
  return status;
}
</script>
