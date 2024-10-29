export function preventNewlines(node: HTMLElement) {
  node.addEventListener('keypress', (ev: KeyboardEvent) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      return false;
    }
  });

  node.addEventListener('change', (ev: Event) => {
    const currentTarget = ev.currentTarget;

    if (
      currentTarget instanceof HTMLInputElement ||
      currentTarget instanceof HTMLTextAreaElement
    ) {
      currentTarget.value = currentTarget.value?.replaceAll('\n', '');
    }
  });
}
