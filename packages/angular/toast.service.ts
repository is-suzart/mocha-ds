import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
export type ToastColor =
  | 'rosewater' | 'flamingo' | 'pink' | 'mauve' | 'red' | 'maroon'
  | 'peach' | 'yellow' | 'green' | 'teal' | 'sky' | 'sapphire' | 'blue' | 'lavender';

export interface ToastOptions {
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

export interface ToastItem extends Required<ToastOptions> {
  id: string;
  createdAt: number;
  exiting: boolean;
}

let toastIdCounter = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  show(options: ToastOptions | string): string {
    const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;
    const id = `toast-${++toastIdCounter}`;
    const item: ToastItem = {
      title: '',
      description: '',
      variant: 'info',
      duration: 4000,
      position: 'bottom-right',
      ...opts,
      id,
      createdAt: Date.now(),
      exiting: false,
    };
    this.toasts.update(prev => [...prev, item]);

    if (item.duration > 0) {
      setTimeout(() => this.dismiss(id), item.duration);
    }

    return id;
  }

  dismiss(id: string): void {
    this.toasts.update(prev =>
      prev.map(t => t.id === id ? { ...t, exiting: true } : t)
    );
    setTimeout(() => {
      this.toasts.update(prev => prev.filter(t => t.id !== id));
    }, 200);
  }

  success(title: string, description?: string): string {
    return this.show({ title, description, variant: 'success' });
  }

  error(title: string, description?: string): string {
    return this.show({ title, description, variant: 'error' });
  }

  warning(title: string, description?: string): string {
    return this.show({ title, description, variant: 'warning' });
  }

  info(title: string, description?: string): string {
    return this.show({ title, description, variant: 'info' });
  }
}
