import { getThemes } from 'src/theme/theme-reference';
import { debug } from './logging';
import { CONSTANTS } from 'src/constants';
import { settings, type CurrentSettings } from 'src/settings/settings.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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

export function applyMutableSettingAttributesToWindow(
  currentSettings: CurrentSettings,
  element?: HTMLElement
) {
  if (!element) {
    return;
  }

  const theme = getCurrentTheme(currentSettings);

  if (theme) {
    debug(`Applying theme type ${theme.type} to window`);
    element.setAttribute('data-tidy-theme-type', theme.type);
  }

  if (currentSettings.lockConfigureSheet && !FoundryAdapter.userIsGm()) {
    element.setAttribute('data-tidy-lock-configure-sheet', 'true');
  } else {
    element.removeAttribute('data-tidy-lock-configure-sheet');
  }
}

export function getCurrentTheme(currentSettings: CurrentSettings) {
  let themeId = currentSettings.colorScheme;

  themeId =
    themeId === CONSTANTS.THEME_ID_DEFAULT
      ? settings.value.defaultTheme
      : themeId;

  const themes = getThemes();
  const theme = themes[themeId];
  return theme;
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
  applyMutableSettingAttributesToWindow(settings.value, element);
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
