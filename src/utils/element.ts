const inputTagNames = new Set([
  'INPUT',
  'BUTTON',
  'SELECT',
  'COLOR',
  'DATE',
  'DATETIME-LOCAL',
  'EMAIL',
  'FILE',
  'HIDDEN',
  'A',
]);
const inputTabNamesSelector = Array.from(inputTagNames)
  .map((i) => i.toLowerCase())
  .join(', ');

/**
 * Determines whether an HTML element is known to be user interactable—e.g., the user can click, input, or otherwise interact with the element.
 * @param el the element to evaluate
 * @returns whether the element is a standard user-interactable element
 */
export function isUserInteractable(el: HTMLElement) {
  return (
    // Is it one of the known interactables?
    inputTagNames.has(el.tagName) ||
    // Is it contained within an interactable?
    el.closest(inputTabNamesSelector)
  );
}
