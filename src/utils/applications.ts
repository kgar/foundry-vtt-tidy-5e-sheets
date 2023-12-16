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

export function applyModuleSheetDataAttributeToWindow(element?: HTMLElement) {
  element?.setAttribute('data-sheet-module', 'tidy5e-sheet');
}
