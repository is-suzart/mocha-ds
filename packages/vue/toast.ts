import { type Ref, ref } from 'vue';

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

let toastCount = 0;
const moduleListeners = new Set<(opts: ToastOptions & { id: string }) => void>();

export function toast(options: ToastOptions | string): string {
  const opts: ToastOptions = typeof options === 'string' ? { title: options } : options;
  const id = `toast-${++toastCount}`;
  moduleListeners.forEach(fn => fn({ ...opts, id }));
  return id;
}

export const TOAST_STATE_KEY = Symbol('toast-state');

export interface ToastState {
  toasts: Ref<ToastItem[]>;
  show: (opts: ToastOptions & { id: string }) => string;
  dismiss: (id: string) => void;
}

export function registerToastListener(fn: (opts: ToastOptions & { id: string }) => void): () => void {
  moduleListeners.add(fn);
  return () => { moduleListeners.delete(fn); };
}
