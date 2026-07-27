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

    // `toAffect` can point at elements outside this attachment's component
    // (e.g., the sheet window header).
    // Track what we applied to undo it on teardown.
    const appliedClasses = [
      options.trackWhenOffScreen
        ? options.offScreenClass ?? defaultOffScreenClass
        : undefined,
      options.trackWhenOnScreen
        ? options.onScreenClass ?? defaultOnScreenClass
        : undefined,
    ].filter((c) => c !== undefined);

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

      if (!appliedClasses.length) {
        return;
      }

      // For 'self', the affected elements are whichever observed element the
      // callback happened to fire for; the full observed set covers them all.
      const affected =
        options.toAffect === 'self'
          ? options.toObserve ?? []
          : options.toAffect ?? [];

      affected.forEach((el) => el?.classList.remove(...appliedClasses));
    };
  };
}
