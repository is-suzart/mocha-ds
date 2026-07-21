<template>
  <div v-if="variant === 'carousel'" class="steps-carousel" :data-color="color">
    <button
      v-for="(_, index) in stepsCount"
      :key="index"
      :class="['steps-carousel-dot', { 'steps-carousel-dot--active': index === currentStep }]"
      @click="emit('change-step', index)"
      :aria-label="`Go to step ${index + 1}`"
    />
  </div>

  <div v-else :class="['steps-timeline', orientation === 'vertical' ? 'steps-timeline--vertical' : 'steps-timeline--horizontal', `steps--${color}`]">
    <div class="steps-track">
      <div
        class="steps-progress"
        :style="orientation === 'vertical' ? { height: `${progressWidth}%` } : { width: `${progressWidth}%` }"
      />
    </div>

    <button
      v-for="(_, index) in stepsCount"
      :key="index"
      :class="[
        'steps-item',
        {
          'steps-item--active': index === currentStep,
          'steps-item--completed': index < currentStep
        }
      ]"
      @click="emit('change-step', index)"
      :aria-label="`Step ${index + 1}`"
    >
      <div class="steps-dot" />
      <span v-if="labels[index]" class="steps-label">{{ labels[index] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

interface Props {
  currentStep: number;
  stepsCount: number;
  labels?: string[];
  variant?: StepsVariant;
  color?: StepsColor;
  orientation?: 'horizontal' | 'vertical';
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => [],
  variant: 'timeline',
  color: 'mauve',
  orientation: 'horizontal',
});

const emit = defineEmits<{
  (e: 'change-step', step: number): void;
}>();

const progressWidth = computed(() => {
  if (props.stepsCount <= 1) return 0;
  return (props.currentStep / (props.stepsCount - 1)) * 100;
});
</script>
