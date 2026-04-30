import type { Attachment } from 'svelte/attachments';
import { resizeManager } from 'src/features/resize-observation/ResizeManager';

export function observeResize(callback: (entry: ResizeObserverEntry) => void): Attachment<HTMLElement> {
  return (el: HTMLElement) => {
    resizeManager.observe(el, callback);
    return () => resizeManager.unobserve(el);
  };
}
