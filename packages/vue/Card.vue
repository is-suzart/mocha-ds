<template>
  <div
    :class="cardClass"
    :data-variant="variant"
    :data-shape="shape"
    :data-padding="padding"
    :data-color="accentColor"
    :data-accent="accentColor && accentPosition !== 'none' ? accentPosition : undefined"
    :data-interactive="isInteractive ? 'true' : undefined"
    v-bind="$attrs"
  >
    <!-- Header Slot / Element -->
    <div v-if="$slots.header || title || subtitle || $slots.avatar || $slots.actions" class="card-header">
      <div v-if="$slots.avatar" class="card-avatar">
        <slot name="avatar" />
      </div>
      <div v-if="title || subtitle || $slots.header" class="card-header-content">
        <slot name="header">
          <h3 v-if="title" class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Media Slot / Element -->
    <div v-if="$slots.media || mediaSrc" class="card-media">
      <slot name="media">
        <img :src="mediaSrc" :alt="mediaAlt" />
      </slot>
    </div>

    <!-- Body Slot / Element -->
    <div class="card-body">
      <slot />
    </div>

    <!-- Footer Slot / Element -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type CardVariant = 'filled' | 'elevated' | 'outline' | 'flat' | 'colored';
type CardShape = 'square' | 'rounded' | 'pill';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardAccentColor =
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
type CardAccentPosition = 'top' | 'left' | 'none';

interface Props {
  variant?: CardVariant;
  shape?: CardShape;
  padding?: CardPadding;
  accentColor?: CardAccentColor;
  accentPosition?: CardAccentPosition;
  isInteractive?: boolean;
  title?: string;
  subtitle?: string;
  mediaSrc?: string;
  mediaAlt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  shape: 'rounded',
  padding: 'md',
  accentPosition: 'none',
  isInteractive: false,
  mediaAlt: '',
});

const cardClass = computed(() => {
  return 'card';
});
</script>
