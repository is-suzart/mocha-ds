<template>
  <div class="datepicker" style="position:relative;display:inline-block">
    <button
      :class="triggerClass"
      @click="toggleOpen"
      type="button"
      :disabled="disabled"
    >
      {{ displayText }}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="datepicker-popover"
      style="position:absolute;top:calc(100% + 4px);left:0;z-index:1050"
    >
      <div class="datepicker-header">
        <button @click="prevMonth" type="button">&lsaquo;</button>
        <span>{{ MONTHS[viewMonth] }} {{ viewYear }}</span>
        <button @click="nextMonth" type="button">&rsaquo;</button>
      </div>
      <div class="datepicker-grid">
        <span v-for="day in DAYS" :key="day" class="datepicker-weekday">{{ day }}</span>
      </div>
      <div class="datepicker-grid">
        <template v-for="(d, idx) in calendarDays" :key="idx">
          <span v-if="d === null" class="datepicker-cell"></span>
          <button
            v-else
            type="button"
            class="datepicker-cell"
            :class="{ 'datepicker-cell--selected': isSelected(d) }"
            @click="selectDate(d)"
          >
            {{ d }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type DatePickerColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

interface Props {
  modelValue?: Date | null;
  color?: DatePickerColor;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  color: 'mauve',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Date | null): void;
}>();

const isOpen = ref(false);
const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth());

const triggerClass = computed(() => {
  return [
    'datepicker-trigger',
    isOpen.value ? 'datepicker-trigger--open' : '',
    `datepicker-trigger--${props.color}`,
  ];
});

const displayText = computed(() => {
  if (!props.modelValue) return 'Selecione uma data...';
  const d = props.modelValue;
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
});

const calendarDays = computed(() => getCalendarDays(viewYear.value, viewMonth.value));

function isSelected(day: number): boolean {
  if (!props.modelValue) return false;
  return props.modelValue.getDate() === day &&
    props.modelValue.getMonth() === viewMonth.value &&
    props.modelValue.getFullYear() === viewYear.value;
}

function toggleOpen() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.modelValue) {
    viewYear.value = props.modelValue.getFullYear();
    viewMonth.value = props.modelValue.getMonth();
  }
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewYear.value--;
    viewMonth.value = 11;
  } else {
    viewMonth.value--;
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewYear.value++;
    viewMonth.value = 0;
  } else {
    viewMonth.value++;
  }
}

function selectDate(day: number) {
  const selected = new Date(viewYear.value, viewMonth.value, day);
  emit('update:modelValue', selected);
  isOpen.value = false;
}
</script>
