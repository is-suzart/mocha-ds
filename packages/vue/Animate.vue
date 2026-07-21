<template>
  <div ref="containerRef" :class="animClass" :style="animStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

type AnimationName =
  | 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
  | 'scale-in' | 'slide-up' | 'slide-down' | 'blur-in' | 'bounce-in'
  | 'spin' | 'pulse';

type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';

type AnimationEasing = 'out' | 'in-out' | 'spring';

interface Props {
  animation?: AnimationName;
  duration?: AnimationDuration;
  delay?: number;
  easing?: AnimationEasing;
  once?: boolean;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'fade-up',
  duration: 'normal',
  delay: 0,
  easing: 'out',
  once: true,
  threshold: 0.2,
});

const containerRef = ref<HTMLElement | null>(null);
const visible = ref(false);
let observer: IntersectionObserver | null = null;

const animClass = computed(() => {
  const parts = [
    `anim--${props.animation}`,
    props.duration !== 'normal' ? `anim--duration-${props.duration}` : '',
    props.easing !== 'out' ? `anim--ease-${props.easing}` : '',
  ];
  return parts.filter(Boolean).join(' ');
});

const animStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.delay > 0) style['--ctp-anim-delay'] = `${props.delay}ms`;
  if (!visible.value) style['animationPlayState'] = 'paused';
  return style;
});

onMounted(() => {
  if (!containerRef.value) return;

  const canObserve =
    typeof window !== 'undefined' && 'IntersectionObserver' in window;
  if (!canObserve) {
    visible.value = true;
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visible.value = true;
        if (props.once) observer?.unobserve(containerRef.value!);
      } else if (!props.once) {
        visible.value = false;
      }
    },
    { threshold: props.threshold },
  );

  observer.observe(containerRef.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>
