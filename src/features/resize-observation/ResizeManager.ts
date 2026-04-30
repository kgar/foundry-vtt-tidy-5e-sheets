type ResizeCallback = (entry: ResizeObserverEntry) => void;

const delayMs = 75;

class ResizeManager {
  private observer: ResizeObserver;
  private callbacks = new Map<Element, ResizeCallback>();

  constructor() {
    this.observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const callback = this.callbacks.get(entry.target);
        requestAnimationFrame(() => {
          callback?.(entry);
        });
      }
    });
  }

  observe(el: HTMLElement, callback: ResizeCallback) {
    const wrapped = foundry.utils.throttle(callback, delayMs);
    this.callbacks.set(el, wrapped);
    this.observer.observe(el);
  }

  unobserve(el: HTMLElement) {
    this.callbacks.delete(el);
    this.observer.unobserve(el);
  }
}

export const resizeManager = new ResizeManager();
