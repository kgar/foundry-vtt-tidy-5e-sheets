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
    { signal: controller.signal },
  );
  return () => {
    controller.abort();
  };
};

const triggerClickOnKeydown: Attachment<HTMLElement> = (element) => {
  const controller = new AbortController();

  element.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
      }
    },
    { signal: controller.signal },
  );
  return () => {
    controller.abort();
  };
};

export const InputAttachments = {
  selectOnFocus,
  triggerClickOnKeydown,
};
