export function clickOutside(node: HTMLElement) {
  function handleClick(e: MouseEvent) {
    if (e.target instanceof Node && !node.contains(e.target)) {
      node.dispatchEvent(new CustomEvent('outsideclick'));
    }
  }

  setTimeout(() => {
    window.addEventListener('click', handleClick);
  });

  return {
    destroy() {
      window.removeEventListener('click', handleClick);
    },
  };
}
