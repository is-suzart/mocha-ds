<template>
  <div class="colorpicker" :data-size="size">
    <div class="colorpicker-row">
      <!-- Render Swatches if selected -->
      <div v-if="variant === 'swatches' || variant === 'both'" class="colorpicker-swatches">
        <button
          v-for="(hexVal, colorName) in activeFlavorColors"
          :key="colorName"
          type="button"
          class="colorpicker-chip"
          :data-state="value.toLowerCase() === hexVal.toLowerCase() ? 'active' : undefined"
          :style="{ backgroundColor: hexVal }"
          @click="handleSwatchClick(hexVal)"
          :title="`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} (${hexVal})`"
          :aria-label="colorName as string"
          :aria-pressed="value.toLowerCase() === hexVal.toLowerCase()"
        />
      </div>

      <!-- Divider if both are shown -->
      <div v-if="variant === 'both'" class="colorpicker-divider" />

      <!-- Render Custom Picker Trigger with Popover -->
      <div v-if="variant === 'custom' || variant === 'both'" class="colorpicker-popover-wrapper" ref="popoverRef">
        <button
          type="button"
          class="colorpicker-custom-trigger"
          :style="{ backgroundColor: value }"
          @click="togglePopover"
          aria-label="Custom color spectrum picker"
          :aria-expanded="showPopover"
        />

        <div v-if="showPopover" class="colorpicker-popover">
          <!-- SV Pad -->
          <div
            ref="padRef"
            class="colorpicker-sv-pad"
            :style="{ backgroundColor: hueColor }"
            @mousedown="handlePadMouseDown"
            @touchstart="handlePadTouchStart"
          >
            <div class="colorpicker-sv-gradient-s" />
            <div class="colorpicker-sv-gradient-v" />
            <div
              class="colorpicker-sv-marker"
              :style="{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`
              }"
            />
          </div>
          
          <!-- Hue Slider -->
          <div class="colorpicker-hue-container">
            <input
              type="range"
              min="0"
              max="360"
              :value="hsv.h"
              @input="handleHueSliderChange"
              class="colorpicker-hue-slider"
              aria-label="Hue spectrum selection"
            />
          </div>
          
          <!-- Footer -->
          <div class="colorpicker-popover-footer">
            <div
              class="colorpicker-popover-preview"
              :style="{ backgroundColor: value }"
            />
            <span class="colorpicker-popover-value">
              {{ value.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Render Text hex input -->
      <div v-if="showHexInput" class="colorpicker-input-group">
        <span class="colorpicker-input-prefix">#</span>
        <input
          type="text"
          class="colorpicker-input"
          :value="localHex.replace('#', '').toUpperCase()"
          @input="handleTextInputChange"
          placeholder="FFFFFF"
          aria-label="Hex color value"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

type ColorPickerVariant = 'swatches' | 'custom' | 'both';
type ColorPickerSize = 'sm' | 'md' | 'lg';
type ColorPickerColor =
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

interface FlavorColors {
  rosewater: string;
  flamingo: string;
  pink: string;
  mauve: string;
  red: string;
  maroon: string;
  peach: string;
  yellow: string;
  green: string;
  teal: string;
  sky: string;
  sapphire: string;
  blue: string;
  lavender: string;
}

const flavorColors: Record<'latte' | 'frappe' | 'macchiato' | 'mocha', FlavorColors> = {
  latte: {
    rosewater: '#dc8a78',
    flamingo: '#dd7878',
    pink: '#ea76cb',
    mauve: '#8839ef',
    red: '#d20f39',
    maroon: '#e64553',
    peach: '#fe640b',
    yellow: '#df8e1d',
    green: '#40a02b',
    teal: '#179287',
    sky: '#04a5e5',
    sapphire: '#209fb5',
    blue: '#1e66f5',
    lavender: '#7287fd'
  },
  frappe: {
    rosewater: '#f2d5cf',
    flamingo: '#eebebe',
    pink: '#f4b8e4',
    mauve: '#ca9ee6',
    red: '#e78284',
    maroon: '#ea999c',
    peach: '#ef9f76',
    yellow: '#e5c890',
    green: '#a6d189',
    teal: '#81c8be',
    sky: '#99d1db',
    sapphire: '#85c1dc',
    blue: '#8caaee',
    lavender: '#babbf1'
  },
  macchiato: {
    rosewater: '#f4dbd6',
    flamingo: '#f0c6c6',
    pink: '#f5bde6',
    mauve: '#c6a0f6',
    red: '#ed8796',
    maroon: '#ee99a0',
    peach: '#f5a97f',
    yellow: '#eed49f',
    green: '#a6da95',
    teal: '#8bd5ca',
    sky: '#91d7e3',
    sapphire: '#7dc4e4',
    blue: '#8aadf4',
    lavender: '#b7bdf8'
  },
  mocha: {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe'
  }
};

// Hex to HSV Helper
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let r = 0, g = 0, b = 0;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
}

// HSV to Hex Helper
function hsvToHex(h: number, s: number, v: number): string {
  const sat = s / 100;
  const val = v / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h <= 360) {
    r = c; g = 0; b = x;
  }
  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
}

interface Props {
  value: string;
  flavor?: 'latte' | 'frappe' | 'macchiato' | 'mocha';
  variant?: ColorPickerVariant;
  size?: ColorPickerSize;
  color?: ColorPickerColor;
  showHexInput?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  flavor: 'mocha',
  variant: 'both',
  size: 'md',
  color: 'mauve',
  showHexInput: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const localHex = ref(props.value);
const showPopover = ref(false);
const hsv = ref({ h: 280, s: 100, v: 100 });

const popoverRef = ref<HTMLDivElement | null>(null);
const padRef = ref<HTMLDivElement | null>(null);

// Watch for external value changes
watch(() => props.value, (newVal) => {
  localHex.value = newVal;
  const hexRegex = /^#[0-9a-fA-F]{6}$/;
  if (hexRegex.test(newVal)) {
    hsv.value = hexToHsv(newVal);
  }
}, { immediate: true });

const activeFlavorColors = computed(() => flavorColors[props.flavor]);


const hueColor = computed(() => {
  return hsvToHex(hsv.value.h, 100, 100);
});

function togglePopover() {
  showPopover.value = !showPopover.value;
}

function handleSwatchClick(hexVal: string) {
  const cleanHex = hexVal.toLowerCase();
  localHex.value = cleanHex;
  emit('update:modelValue', cleanHex);
  emit('change', cleanHex);
}

// Drag logic for Saturation/Value Pad
function handlePadChange(clientX: number, clientY: number) {
  if (!padRef.value) return;
  const rect = padRef.value.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

  const newS = Math.round(x * 100);
  const newV = Math.round((1 - y) * 100);

  hsv.value.s = newS;
  hsv.value.v = newV;

  const hex = hsvToHex(hsv.value.h, newS, newV);
  emit('update:modelValue', hex);
  emit('change', hex);
}

function handlePadMouseDown(e: MouseEvent) {
  handlePadChange(e.clientX, e.clientY);

  const handleMouseMove = (moveEvent: MouseEvent) => {
    handlePadChange(moveEvent.clientX, moveEvent.clientY);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}

function handlePadTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;
  handlePadChange(touch.clientX, touch.clientY);

  const handleTouchMove = (moveEvent: TouchEvent) => {
    const moveTouch = moveEvent.touches[0];
    if (moveTouch) {
      handlePadChange(moveTouch.clientX, moveTouch.clientY);
    }
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);
}

function handleHueSliderChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const newH = parseInt(target.value);
  hsv.value.h = newH;
  
  const hex = hsvToHex(newH, hsv.value.s, hsv.value.v);
  emit('update:modelValue', hex);
  emit('change', hex);
}

function handleTextInputChange(e: Event) {
  const target = e.target as HTMLInputElement;
  let textVal = target.value;
  if (!textVal.startsWith('#')) {
    textVal = '#' + textVal;
  }
  textVal = textVal.substring(0, 7);
  localHex.value = textVal;

  const hexRegex = /^#[0-9a-fA-F]{6}$/;
  if (hexRegex.test(textVal)) {
    const cleanHex = textVal.toLowerCase();
    emit('update:modelValue', cleanHex);
    emit('change', cleanHex);
  }
}

// Handle outside clicks
function handleOutsideClick(e: MouseEvent) {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    showPopover.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick);
});
</script>
