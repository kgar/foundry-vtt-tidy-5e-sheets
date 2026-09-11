import { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type { Item5e } from 'src/types/item.types';
import type { Attachment } from 'svelte/attachments';

export function onDropToContainer(container: Item5e): Attachment<HTMLElement> {
  return (el: HTMLElement) => {
    const controller = new AbortController();
    el.addEventListener(
      'drop',
      (event: DragEvent) => {
        const sheet = new Tidy5eContainerSheetQuadrone({ document: container });

        sheet._onDrop(
          event as DragEvent & {
            currentTarget: EventTarget & HTMLElement;
            target: HTMLElement;
          },
        );

        event.preventDefault();
        event.stopImmediatePropagation();
      },
      {
        signal: controller.signal,
      },
    );

    return () => {
      controller.abort();
    };
  };
}
