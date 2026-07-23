import { Injectable, InjectionToken, inject, signal } from '@angular/core';

export const MOCHA_PREFIX = new InjectionToken<string>('MOCHA_PREFIX', {
  factory: () => '',
});

@Injectable({ providedIn: 'root' })
export class PrefixService {
  readonly prefix = signal<string>('');

  constructor() {
    try {
      const injected = inject(MOCHA_PREFIX, { optional: true });
      if (injected) {
        this.prefix.set(injected);
      }
    } catch {
      // Not provided, keep default empty string
    }
  }
}
