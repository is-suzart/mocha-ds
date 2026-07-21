<template>
  <div class="steps-content-wrapper">
    <div
      class="steps-content-stage"
      :style="{ transform: `translateX(-${currentStep * 100}%)` }"
    >
      <div
        v-for="(node, index) in slides"
        :key="index"
        :class="['steps-content-slide', { 'steps-content-slide--active': index === currentStep }]"
      >
        <component :is="node" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots, computed } from 'vue';

interface Props {
  currentStep: number;
}

defineProps<Props>();

const slots = useSlots();

const slides = computed(() => {
  if (!slots.default) return [];
  const rawChildren = slots.default();
  return rawChildren.flatMap(child => {
    if (child.type && typeof child.type === 'symbol' && child.type.description === 'v-fgt' && Array.isArray(child.children)) {
      return child.children;
    }
    return child;
  });
});
</script>
