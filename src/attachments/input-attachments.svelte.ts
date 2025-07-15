import type { Attachment } from 'svelte/attachments';

const selectOnFocus: Attachment<HTMLInputElement> = (element) => {
  const controller = new AbortController();

  element.addEventListener(
    'focus',
    (ev) => {
      if (ev.currentTarget instanceof HTMLInputElement) {
        ev.currentTarget.select();
      }
    },
    { signal: controller.signal }
  );
  return () => {
    controller.abort();
  };
};

export const InputAttachments = {
  selectOnFocus,
};
