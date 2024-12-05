export function clickOutside(
  node: HTMLElement,
  { callback }: { callback?: (event: MouseEvent, node: HTMLElement) => void }
) {
  $effect(() => {
    const { signal, abort } = new AbortController();

    setTimeout(() => {
      window.addEventListener(
        'click',
        (e: MouseEvent) => {
          if (e.target instanceof Node && !node.contains(e.target)) {
            callback?.(e, node);
          }
        },
        { signal }
      );
    });

    return () => {
      abort();
    };
  });
}
