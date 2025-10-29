import type { CustomHeaderControlsEntry } from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationHeaderControlsEntry } from 'src/types/application.types';

export const tidyHeaderAttribute = 'data-tidy-header-control';

export function createHeaderButton(
  control: ApplicationHeaderControlsEntry | CustomHeaderControlsEntry
): HTMLElement {
  const label = FoundryAdapter.localize(control.label);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `header-control icon ${control.icon ?? ''}`;
  button.dataset.action = control.action;
  button.dataset.tooltip = '';
  button.ariaLabel = label;
  button.setAttribute(tidyHeaderAttribute, '');

  if ('onClick' in control && typeof control.onClick === 'function') {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      control.onClick?.(event);
    });
  }
  
  return button;
}

export function insertHeaderButton(
  app: any,
  sheetElement: HTMLElement,
  control: ApplicationHeaderControlsEntry | CustomHeaderControlsEntry
) {
  let anchor: HTMLElement =
    sheetElement.querySelector('.window-header [data-action="copyUuid"]') ??
    sheetElement.querySelector(
      '.window-header [data-action="configureSheet"]'
    ) ??
    app.window.close;

  let headerButton = createHeaderButton(control);

  if (anchor && headerButton) {
    anchor.insertAdjacentElement('beforebegin', headerButton);
  }
}

export function removeTidyHeaderButtons(sheetElement: HTMLElement) {
  sheetElement
    .querySelectorAll<HTMLElement>(`.window-header [${tidyHeaderAttribute}]`)
    .forEach((el: HTMLElement) => el.remove());
}
