<template>
  <div :class="containerClass">
    <div class="text-editor-toolbar">
      <button
        type="button"
        @click="exec('bold')"
        :class="{ 'text-editor-btn--active': activeTags.includes('B') }"
        title="Negrito"
      ><strong>B</strong></button>
      <button
        type="button"
        @click="exec('italic')"
        :class="{ 'text-editor-btn--active': activeTags.includes('I') }"
        title="Itálico"
      ><em>I</em></button>
      <button
        type="button"
        @click="exec('underline')"
        :class="{ 'text-editor-btn--active': activeTags.includes('U') }"
        title="Sublinhado"
      ><u>U</u></button>
    </div>
    <div
      ref="editorRef"
      class="text-editor-content"
      contenteditable="true"
      @input="onInput"
      @keydown="onKeydown"
    ></div>
    <div v-if="showCount" class="text-editor-footer">{{ content.length }} caracteres</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type TextEditorColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

interface Props {
  modelValue?: string;
  placeholder?: string;
  color?: TextEditorColor;
  readOnly?: boolean;
  showCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Digite aqui...',
  color: 'mauve',
  readOnly: false,
  showCount: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const editorRef = ref<HTMLElement | null>(null);
const content = ref('');
const activeTags = ref<string[]>([]);

const containerClass = computed(() => {
  return [
    'text-editor',
    `text-editor--${props.color}`,
  ];
});

function exec(command: string) {
  document.execCommand(command, false);
  updateContent();
  updateActiveTags();
}

function onInput() {
  updateContent();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    event.preventDefault();
    document.execCommand('insertHTML', false, '\u00A0\u00A0\u00A0\u00A0');
  }
}

function updateContent() {
  if (editorRef.value) {
    content.value = editorRef.value.innerHTML;
    emit('update:modelValue', content.value);
  }
}

function updateActiveTags() {
  const tags: string[] = [];
  if (document.queryCommandState('bold')) tags.push('B');
  if (document.queryCommandState('italic')) tags.push('I');
  if (document.queryCommandState('underline')) tags.push('U');
  activeTags.value = tags;
}
</script>
