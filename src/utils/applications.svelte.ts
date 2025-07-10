import { TidyFlags } from "src/foundry/TidyFlags";
import { debug } from './logging';
import { getThemeV2 } from 'src/theme/theme';
import { settings } from 'src/settings/settings.svelte';
import type { ThemeSettingsV2 } from 'src/theme/theme-quadrone.types';

export function applyTitleToWindow(title: string, element: HTMLElement) {
  if (!element) {
    return;
  }

  let windowTitle: HTMLElement | ChildNode | null =
    element.querySelector('.window-title');

  if (windowTitle?.hasChildNodes()) {
    windowTitle = windowTitle.childNodes[0];
  }

  if (!windowTitle) {
    return;
  }

  if (windowTitle.textContent !== title) {
    windowTitle.textContent = title;
  }
}

export function applyThemeToApplication(element?: HTMLElement, doc?: any) {
  if (!element) {
    return;
  }

  const theme = getThemeV2(doc);

  if (theme) {
    debug(`Applying theme type ${theme} to window`);

    // Quadrone
    element.classList.remove('theme-light', 'theme-dark');
    element.classList.add(`themed`);
    element.classList.add(`theme-${theme}`);
  }
}

export function applySheetAttributesToWindow(
  documentName: string,
  documentUuid: string,
  type: string,
  element?: HTMLElement
) {
  element?.setAttribute('data-sheet-module', 'tidy5e-sheet');
  element?.setAttribute('data-document-name', documentName);
  element?.setAttribute('data-document-type', type);
  element?.setAttribute('data-document-uuid', documentUuid);
}

export async function maintainCustomContentInputFocus(
  app: any,
  asyncRender: () => Promise<unknown>
) {
  // TODO: Eliminate jQuery
  let focus = globalThis.$(app.element).find(':focus');
  focus = focus.length ? focus[0] : null;

  await asyncRender();

  if (focus && focus.name) {
    const input = app.form?.[focus.name];
    if (input && input.focus instanceof Function) input.focus();
  }
}

export function blurUntabbableButtonsOnClick(element: HTMLElement) {
  element.removeEventListener('click', blurUntabbableButton);
  element.addEventListener('click', blurUntabbableButton);
}

function blurUntabbableButton(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const button = target.closest('button');

  if (button?.tabIndex === -1) {
    target.blur();
  }
}
