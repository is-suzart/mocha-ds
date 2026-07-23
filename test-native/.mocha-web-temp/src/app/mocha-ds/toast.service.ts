import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  filled?: boolean;
  color?: ToastColor;
  className?: string;
  style?: Record<string, string>;
}

export interface ToastItem {
  id: string;
  title: string;
  description: string;
  variant: ToastVariant;
  duration: number;
  position: ToastPosition;
  filled: boolean;
  color: ToastColor | '';
  className: string;
  style: Record<string, string>;
  createdAt: number;
  exiting: boolean;
}

let toastIdCounter = 0;

const defaultToast: Omit<ToastItem, 'id' | 'createdAt' | 'exiting'> = {
  title: '',
  description: '',
  variant: 'info',
  duration: 4000,
  position: 'bottom-right',
  filled: false,
  color: '',
  className: '',
  style: {},
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  /** Programmatic toast function (static-style) */
  toast(options: ToastOptions | string): string {
    const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;
    const id = `toast-${++toastIdCounter}`;
    const item: ToastItem = {
      ...defaultToast,
      ...opts,
      id: opts.id || id,
      createdAt: Date.now(),
      exiting: false,
    };
    this.toasts.update(prev => [...prev, item]);
    return item.id;
  }

  dismiss(id: string): void {
    this.toasts.update(prev =>
      prev.map(t => t.id === id && !t.exiting ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      this.toasts.update(prev => prev.filter(t => t.id !== id));
    }, 200);
  }

  success(title: string, description?: string): string {
    return this.toast({ title, description, variant: 'success' });
  }

  error(title: string, description?: string): string {
    return this.toast({ title, description, variant: 'error' });
  }

  warning(title: string, description?: string): string {
    return this.toast({ title, description, variant: 'warning' });
  }

  info(title: string, description?: string): string {
    return this.toast({ title, description, variant: 'info' });
  }
}
