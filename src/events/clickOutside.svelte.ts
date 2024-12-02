export function clickOutside(
  node: HTMLElement,
  { callback }: { callback?: (event: MouseEvent, node: HTMLElement) => void }
) {
  $effect(() => {
    function handleClick(e: MouseEvent) {
      if (e.target instanceof Node && !node.contains(e.target)) {
        callback?.(e, node);
      }
    }

    setTimeout(() => {
      window.addEventListener('click', handleClick);
    });

    return () => {
      window.removeEventListener('click', handleClick);
    };
  });
}
