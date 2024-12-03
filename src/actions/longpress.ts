export function longpress(node: HTMLElement, threshold: number = 500) {
  const handleMouseDown = () => {
    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress'));
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

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMouseDown);
    },
  };
}
