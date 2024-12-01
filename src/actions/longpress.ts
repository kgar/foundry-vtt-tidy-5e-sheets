export type LongpressEventCallback = (node: HTMLElement) => void;

export function longpress(
  node: HTMLElement,
  options: { callback?: LongpressEventCallback; threshold?: number } = {}
) {
  const threshold = options?.threshold ?? 500;

  $effect(() => {
    const handleMouseDown = () => {
      const abortController = new AbortController();
      const timeout = setTimeout(() => {
        options?.callback?.(node);
      }, threshold);

      const cancel = () => {
        clearTimeout(timeout);
        abortController.abort();
      };

      let cancellableActions: (keyof HTMLElementEventMap)[] = [
        'mouseleave',
        'mouseup',
        'touchend',
        'touchmove', // TODO: use `touchleave` whenever it's widely available
      ];

      cancellableActions.forEach((a) =>
        node.addEventListener(a, cancel, {
          signal: abortController.signal,
        })
      );
    };

    // Touch start
    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('touchstart', handleMouseDown);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleMouseDown);
    };
  });
}
