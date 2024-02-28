import { getThemes } from 'src/theme/theme-reference';
import { debug } from './logging';

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

export function applyThemeDataAttributeToWindow(
  themeId: string,
  element?: HTMLElement
) {
  if (!element) {
    return;
  }
  const themes = getThemes();
  const theme = themes[themeId];
  if (theme) {
    debug(`Applying theme type ${theme.type} to window`);
    element.setAttribute('data-tidy-theme-type', theme.type);
  }
}

export function applySheetAttributesToWindow(
  documentName: string,
  type: string,
  themeId: string,
  element?: HTMLElement
) {
  element?.setAttribute('data-sheet-module', 'tidy5e-sheet');
  element?.setAttribute('data-document-name', documentName);
  element?.setAttribute('data-document-type', type);
  applyThemeDataAttributeToWindow(themeId, element);
}

export async function maintainCustomContentInputFocus(
  app: any,
  asyncRender: () => Promise<unknown>
) {
  let focus = app.element.find(':focus');
  focus = focus.length ? focus[0] : null;

  await asyncRender();

  if (focus && focus.name) {
    const input = app.form?.[focus.name];
    if (input && input.focus instanceof Function) input.focus();
  }
}

export function blurUntabbableButtonsOnClick(element: any /* jQuery */) {
  element
    .off('click.tidy-keyboard-accessibility', '[tabindex="-1"]')
    .on('click.tidy-keyboard-accessibility', '[tabindex="-1"]', (ev: any) => {
      ev.currentTarget?.blur();
    });
}
