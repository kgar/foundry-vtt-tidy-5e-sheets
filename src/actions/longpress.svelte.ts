export type LongpressEventCallback = (node: HTMLElement) => void;

export function longpress(
  node: HTMLElement,
  options: { callback?: LongpressEventCallback; threshold?: number } = {}
) {
  const threshold = options?.threshold ?? 500;

  $effect(() => {
    const controller = new AbortController();

    // Don't let unmounting mid-press leave a timer for a detached node.
    let pendingPress: ReturnType<typeof setTimeout> | undefined;

    const cancel = () => {
      clearTimeout(pendingPress);
      pendingPress = undefined;
    };

    const handlePressStart = () => {
      cancel();

      pendingPress = setTimeout(() => {
        pendingPress = undefined;
        options?.callback?.(node);
      }, threshold);
    };

    let cancellableActions: (keyof HTMLElementEventMap)[] = [
      'mouseleave',
      'mouseup',
      'touchend',
      'touchmove', // TODO: use `touchleave` whenever it's widely available
    ];

    node.addEventListener('mousedown', handlePressStart, {
      signal: controller.signal,
    });
    node.addEventListener('touchstart', handlePressStart, {
      signal: controller.signal,
      passive: true,
    });

    cancellableActions.forEach((a) =>
      node.addEventListener(a, cancel, {
        signal: controller.signal,
        passive: true,
      })
    );

    return () => {
      cancel();
      controller.abort();
    };
  });
}
