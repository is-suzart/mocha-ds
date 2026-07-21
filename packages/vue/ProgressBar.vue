<template>
  <div
    class="progressbar"
    :data-size="size"
    :data-color="color"
    :data-state="indeterminate ? 'indeterminate' : (animated ? 'animated' : (striped ? 'striped' : undefined))"
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : max"
    :aria-label="label"
  >
    <!-- Label group outside -->
    <div v-if="label || (showValue && valuePosition === 'outside')" class="progressbar-label-group">
      <span v-if="label" class="progressbar-label">{{ label }}</span>
      <span v-if="showValue && valuePosition === 'outside' && !indeterminate" class="progressbar-value-text">
        {{ progressPercent }}%
      </span>
    </div>

    <!-- Track & Fill -->
    <div class="progressbar-track">
      <div
        class="progressbar-fill"
        :style="indeterminate ? undefined : { width: `${percent}%` }"
      >
        <!-- Value inside -->
        <span v-if="showValue && valuePosition === 'inside' && size === 'lg' && !indeterminate" class="progressbar-value-inside">
          {{ progressPercent }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ProgressBarSize = 'sm' | 'md' | 'lg';
type ProgressBarColor =
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
  value?: number;
  max?: number;
  size?: ProgressBarSize;
  color?: ProgressBarColor;
  striped?: boolean;
  animated?: boolean;
  indeterminate?: boolean;
  showValue?: boolean;
  valuePosition?: 'inside' | 'outside';
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  size: 'md',
  color: 'mauve',
  striped: false,
  animated: false,
  indeterminate: false,
  showValue: false,
  valuePosition: 'outside',
});

// Clamp value
const normalizedValue = computed(() => {
  if (props.indeterminate) return 0;
  return Math.min(props.max, Math.max(0, props.value));
});

const percent = computed(() => {
  if (props.max <= 0) return 0;
  return (normalizedValue.value / props.max) * 100;
});

const progressPercent = computed(() => Math.round(percent.value));
</script>
