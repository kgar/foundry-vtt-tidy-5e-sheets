export function applyDropzoneClass(
  node: HTMLElement,
  dropzoneClass: string
): any {
  let dragCounter = 0;

  node.addEventListener('dragenter', () => {
    dragCounter++;
    node.classList.add(dropzoneClass);
  });

  node.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) {
      node.classList.remove(dropzoneClass);
    }
  });

  node.addEventListener('drop', () => {
    dragCounter = 0;
    node.classList.remove(dropzoneClass);
  });
}
