import type { Attachment } from 'svelte/attachments';

type VisibilityObserverOptions = {
  root?: IntersectionObserverInit['root'];
  rootMargin?: IntersectionObserverInit['rootMargin'];
  toObserve?: HTMLElement[];
  toAffect?: 'self' | HTMLElement[];
  trackWhenOnScreen?: boolean;
  callback?: (entry: IntersectionObserverEntry) => void;
  onScreenClass?: string;
  trackWhenOffScreen?: boolean;
  offScreenClass?: string;
};

const defaultOnScreenClass = 'on-screen';
const defaultOffScreenClass = 'off-screen';

export function visibilityObserver(
  options: VisibilityObserverOptions
): Attachment<HTMLElement> {
  return (element: HTMLElement) => {
    options.toObserve ??= [element];
    const observer = new IntersectionObserver(
      (entries) => {
        for (var entry of entries) {
          const elementsToUpdate =
            options.toAffect === 'self'
              ? [entry.target]
              : options.toAffect ?? [];

          elementsToUpdate.forEach((el) => {
            if (options.trackWhenOffScreen) {
              el.classList.toggle(
                options.offScreenClass ?? defaultOffScreenClass,
                !entry.isIntersecting
              );
            }

            if (options.trackWhenOnScreen) {
              el.classList.toggle(
                options.onScreenClass ?? defaultOnScreenClass,
                entry.isIntersecting
              );
            }
          });

          options.callback?.(entry);
        }
      },
      {
        root: options.root,
        rootMargin: options.rootMargin,
      }
    );

    options.toObserve?.forEach((el) => !!el && observer.observe(el));

    return () => {
      observer.disconnect();
    };
  };
}
