export function clickOutside(
  node: HTMLElement,
  { callback }: { callback?: (event: MouseEvent, node: HTMLElement) => void }
) {
  $effect(() => {
    const controller = new AbortController();

    setTimeout(() => {
      window.addEventListener(
        'click',
        (e: MouseEvent) => {
          if (e.target instanceof Node && !node.contains(e.target)) {
            callback?.(e, node);
          }
        },
        { signal: controller.signal }
      );
    });

    return () => {
      controller.abort();
    };
  });
}
