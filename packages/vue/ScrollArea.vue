<template>
  <div class="scroll-area" :style="{ height }">
    <div ref="viewport" class="scroll-area-viewport" @scroll="updateThumbs">
      <slot />
    </div>
    <div
      v-if="showVertical"
      class="scroll-area-scrollbar" data-orientation="vertical"
      :style="{ opacity: isDraggingV ? 1 : 0.6 }"
    >
      <div
        class="scroll-area-thumb"
        :style="{ height: thumbHeight + 'px', transform: `translateY(${thumbTop}px)` }"
        @mousedown.prevent="startDragV"
      />
    </div>
    <div
      v-if="showHorizontal"
      class="scroll-area-scrollbar" data-orientation="horizontal"
      :style="{ opacity: isDraggingH ? 1 : 0.6 }"
    >
      <div
        class="scroll-area-thumb"
        :style="{ width: thumbWidth + 'px', transform: `translateX(${thumbLeft}px)` }"
        @mousedown.prevent="startDragH"
      />
    </div>
    <div v-if="showVertical && showHorizontal" class="scroll-area-corner" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
});

const viewport = ref<HTMLElement>();
const showVertical = ref(false);
const showHorizontal = ref(false);
const thumbTop = ref(0);
const thumbLeft = ref(0);
const thumbHeight = ref(0);
const thumbWidth = ref(0);
const isDraggingV = ref(false);
const isDraggingH = ref(false);

function updateThumbs() {
  const vp = viewport.value;
  if (!vp) return;

  const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = vp;

  showVertical.value = scrollHeight > clientHeight;
  showHorizontal.value = scrollWidth > clientWidth;

  if (scrollHeight > clientHeight) {
    thumbHeight.value = (clientHeight / scrollHeight) * clientHeight;
    thumbTop.value = (scrollTop / scrollHeight) * clientHeight;
  }
  if (scrollWidth > clientWidth) {
    thumbWidth.value = (clientWidth / scrollWidth) * clientWidth;
    thumbLeft.value = (scrollLeft / scrollWidth) * clientWidth;
  }
}

function startDragV(e: MouseEvent) {
  isDraggingV.value = true;
  const vp = viewport.value!;
  const startY = e.clientY;
  const startScrollTop = vp.scrollTop;

  function onMove(ev: MouseEvent) {
    const dy = ev.clientY - startY;
    const ratio = dy / (vp.clientHeight - thumbHeight.value);
    vp.scrollTop = startScrollTop + ratio * (vp.scrollHeight - vp.clientHeight);
  }

  function onUp() {
    isDraggingV.value = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function startDragH(e: MouseEvent) {
  isDraggingH.value = true;
  const vp = viewport.value!;
  const startX = e.clientX;
  const startScrollLeft = vp.scrollLeft;

  function onMove(ev: MouseEvent) {
    const dx = ev.clientX - startX;
    const ratio = dx / (vp.clientWidth - thumbWidth.value);
    vp.scrollLeft = startScrollLeft + ratio * (vp.scrollWidth - vp.clientWidth);
  }

  function onUp() {
    isDraggingH.value = false;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

let ro: ResizeObserver;

onMounted(() => {
  if (viewport.value) {
    ro = new ResizeObserver(updateThumbs);
    ro.observe(viewport.value);
    updateThumbs();
  }
});

onUnmounted(() => {
  ro?.disconnect();
});
</script>
