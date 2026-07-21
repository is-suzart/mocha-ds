<template>
  <div class="carousel" role="region" aria-label="Carousel">
    <div class="carousel-viewport">
      <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <div
          v-for="(_, i) in slides"
          :key="i"
          class="carousel-slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="`Slide ${i + 1} of ${slides.length}`"
        >
          <slot />
        </div>
      </div>
    </div>
    <button
      v-if="showArrows && slides.length > 1"
      class="carousel-btn carousel-btn" data-state="prev"
      :disabled="current === 0"
      @click="prev"
      aria-label="Previous slide"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <button
      v-if="showArrows && slides.length > 1"
      class="carousel-btn carousel-btn" data-state="next"
      :disabled="current === slides.length - 1"
      @click="next"
      aria-label="Next slide"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
    <div v-if="showDots && slides.length > 1" class="carousel-dots" role="tablist" aria-label="Slides">
      <button
        v-for="(_, i) in slides"
        :key="i"
        class="carousel-dot" :data-state="i === current ? 'active' : undefined"
        @click="goTo(i)"
        role="tab"
        :aria-selected="i === current"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showArrows: true,
  showDots: true,
  autoPlay: false,
  autoPlayInterval: 4000,
});

const slots = useSlots();
const slides = computed(() => (slots.default?.() || []).filter(Boolean));

const current = ref(0);
let intervalId: ReturnType<typeof setInterval> | null = null;

function goTo(index: number) {
  current.value = Math.max(0, Math.min(index, slides.value.length - 1));
}

function prev() { goTo(current.value - 1); }
function next() { goTo(current.value + 1); }

onMounted(() => {
  if (props.autoPlay && slides.value.length > 1) {
    intervalId = setInterval(next, props.autoPlayInterval);
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
