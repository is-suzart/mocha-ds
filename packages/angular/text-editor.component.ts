import { Component, input, computed, output, signal, ElementRef } from '@angular/core';

export type TextEditorColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire'
  | 'blue' | 'lavender';

@Component({
  selector: 'text-editor',
  standalone: true,
  template: `
    <div [class]="containerClass()">
      <div class="text-editor-toolbar">
        <button type="button" (click)="exec('bold')" [class.text-editor-btn--active]="activeTags().includes('B')" title="Negrito"><strong>B</strong></button>
        <button type="button" (click)="exec('italic')" [class.text-editor-btn--active]="activeTags().includes('I')" title="Itálico"><em>I</em></button>
        <button type="button" (click)="exec('underline')" [class.text-editor-btn--active]="activeTags().includes('U')" title="Sublinhado"><u>U</u></button>
      </div>
      <div
        #editorRef
        class="text-editor-content"
        contenteditable="true"
        (input)="onInput()"
        (keydown)="onKeydown($event)"
      ></div>
      @if (showCount()) {
        <div class="text-editor-footer">{{ content().length }} caracteres</div>
      }
    </div>
  `
})
export class TextEditorComponent {
  value = input<string>('');
  placeholder = input<string>('Digite aqui...');
  color = input<TextEditorColor>('mauve');
  readOnly = input<boolean>(false);
  showCount = input<boolean>(false);

  valueChange = output<string>();

  activeTags = signal<string[]>([]);
  content = signal('');

  constructor(private el: ElementRef) {}

  protected containerClass = computed(() => {
    return [
      'text-editor',
      `text-editor--${this.color()}`,
    ].filter(Boolean).join(' ');
  });

  exec(command: string) {
    document.execCommand(command, false);
    this.updateContent();
    this.updateActiveTags();
  }

  onInput() {
    this.updateContent();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;');
    }
  }

  private updateContent() {
    const editorEl = this.el.nativeElement.querySelector('.text-editor-content');
    if (editorEl) {
      this.content.set(editorEl.innerHTML);
      this.valueChange.emit(editorEl.innerHTML);
    }
  }

  private updateActiveTags() {
    const tags: string[] = [];
    if (document.queryCommandState('bold')) tags.push('B');
    if (document.queryCommandState('italic')) tags.push('I');
    if (document.queryCommandState('underline')) tags.push('U');
    this.activeTags.set(tags);
  }
}
