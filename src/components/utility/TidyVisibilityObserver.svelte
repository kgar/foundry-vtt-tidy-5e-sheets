<script lang="ts">
  interface Props {
    root?: IntersectionObserverInit['root'];
    rootMargin?: IntersectionObserverInit['rootMargin'];
    toObserve?: HTMLElement[];
    toAffect?: 'self' | HTMLElement[];
    trackWhenOnScreen?: boolean;
    callback?: (entry: IntersectionObserverEntry) => void;
    onScreenClass?: string;
    trackWhenOffScreen?: boolean;
    offScreenClass?: string;
  }

  let {
    root,
    rootMargin,
    toObserve,
    toAffect,
    trackWhenOnScreen = false,
    onScreenClass = 'on-screen',
    callback,
    trackWhenOffScreen = false,
    offScreenClass = 'off-screen',
  }: Props = $props();

  $effect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (var entry of entries) {
          const elementsToUpdate =
            toAffect === 'self' ? [entry.target] : (toAffect ?? []);

          elementsToUpdate.forEach((el) => {
            if (trackWhenOffScreen) {
              el.classList.toggle(offScreenClass, !entry.isIntersecting);
            }

            if (trackWhenOnScreen) {
              el.classList.toggle(onScreenClass, entry.isIntersecting);
            }
          });

          callback?.(entry);
        }
      },
      {
        root,
        rootMargin,
      },
    );

    toObserve?.forEach((el) => !!el && observer.observe(el));

    return () => {
      observer.disconnect();
    };
  });
</script>
