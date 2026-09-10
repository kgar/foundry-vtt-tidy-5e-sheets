import { TidyFlags } from "src/foundry/TidyFlags";
import { debug } from './logging';
import { getThemeV2 } from 'src/theme/theme';
import { settings } from 'src/settings/settings.svelte';
import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';

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
