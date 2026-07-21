<template>
  <div :class="tileClass" v-bind="$attrs">
    <slot>
      <div v-if="$slots.icon || icon" class="tile-icon">
        <slot name="icon">{{ icon }}</slot>
      </div>

      <div v-if="$slots.content || title || subtitle" class="tile-content">
        <slot name="content">
          <span v-if="title" class="tile-title">{{ title }}</span>
          <span v-if="subtitle" class="tile-subtitle">{{ subtitle }}</span>
        </slot>
      </div>

      <div v-if="$slots.meta || meta" class="tile-meta">
        <slot name="meta">{{ meta }}</slot>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type TileVariant = 'flat' | 'elevated' | 'outline' | 'tonal' | 'colored';
type TileSize = 'sm' | 'md' | 'lg';
type TileShape = 'square' | 'rounded' | 'pill';
type TileOrientation = 'horizontal' | 'vertical' | 'vertical-center';
type TileIndicator = 'none' | 'top' | 'bottom' | 'left' | 'right';
type TileColor =
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
  variant?: TileVariant;
  size?: TileSize;
  shape?: TileShape;
  orientation?: TileOrientation;
  color?: TileColor;
  indicator?: TileIndicator;
  isInteractive?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  icon?: any;
  title?: string;
  subtitle?: string;
  meta?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'flat',
  size: 'md',
  shape: 'rounded',
  orientation: 'horizontal',
  color: 'mauve',
  indicator: 'none',
  isInteractive: false,
  isSelected: false,
  isDisabled: false,
});

const tileClass = computed(() => {
  return [
    'tile',
    `tile--${props.variant}`,
    `tile--${props.size}`,
    `tile--${props.shape}`,
    `tile--${props.orientation}`,
    props.color ? `tile--${props.color}` : '',
    props.indicator !== 'none' ? `tile--indicator-${props.indicator}` : '',
    props.isInteractive ? 'tile--interactive' : '',
    props.isSelected ? 'tile--selected' : '',
    props.isDisabled ? 'tile--disabled' : '',
  ];
});
</script>
