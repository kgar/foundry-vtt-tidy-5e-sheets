import type { Attachment } from 'svelte/attachments';

/**
 *
 * @param dropzoneClass the class to apply to the dropzone
 * @param selector an optional selector which will put the dropzone class on a child of the attached
 * @returns
 */
export function dropzoneClass(
  dropzoneClass: string,
  selector?: string
): Attachment {
  return (element) => {
    let target = selector
      ? element.querySelector<HTMLElement>(selector) ?? element
      : element;
    let dragCounter = 0;
    let controller = new AbortController();

    element.addEventListener(
      'dragenter',
      () => {
        dragCounter++;
        target.classList.add(dropzoneClass);
      },
      { signal: controller.signal }
    );

    element.addEventListener(
      'dragleave',
      () => {
        dragCounter--;
        if (dragCounter === 0) {
          target.classList.remove(dropzoneClass);
        }
      },
      { signal: controller.signal }
    );

    element.addEventListener(
      'drop',
      () => {
        dragCounter = 0;
        target.classList.remove(dropzoneClass);
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  };
}
