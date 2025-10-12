export function insertAdjacentHTML(
  target: Element,
  position: InsertPosition,
  html: string,
  renderScheme?: string
): Node[] {
  const range = document.createRange();

  const fragment = range.createContextualFragment(html);

  const nodes = Array.from(fragment.childNodes);

  if (renderScheme) {
    for (const node of nodes) {
      if (node instanceof HTMLElement) {
        node.setAttribute('data-tidy-render-scheme', renderScheme);
      }
    }
  }

  switch (position) {
    case 'beforebegin':
      target.before(fragment);
      break;
    case 'afterend':
      target.after(fragment);
      break;
    case 'afterbegin':
      target.insertBefore(fragment, target.firstChild);
      break;
    case 'beforeend':
      target.appendChild(fragment);
      break;
  }

  return Array.from(nodes);
}
