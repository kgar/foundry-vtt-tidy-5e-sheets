export type LongpressEventCallback = (node: HTMLElement) => void;

export function longpress(
  node: HTMLElement,
  options: { callback?: LongpressEventCallback; threshold?: number } = {}
) {
  const threshold = options?.threshold ?? 500;

  $effect(() => {
    const handleMouseDown = () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        options?.callback?.(node);
      }, threshold);

      const cancel = () => {
        clearTimeout(timeout);
        controller.abort();
      };

      let cancellableActions: (keyof HTMLElementEventMap)[] = [
        'mouseleave',
        'mouseup',
        'touchend',
        'touchmove', // TODO: use `touchleave` whenever it's widely available
      ];

      cancellableActions.forEach((a) =>
        node.addEventListener(a, cancel, {
          signal: controller.signal,
        })
      );
    };

    const controller = new AbortController();

    node.addEventListener('mousedown', handleMouseDown, {
      signal: controller.signal,
    });
    node.addEventListener('touchstart', handleMouseDown, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  });
}
