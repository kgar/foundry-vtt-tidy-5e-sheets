import type { Tidy5eTheme as Tidy5eTheme } from 'src/types/theme';
import { themeVariables } from './theme-reference';
import { debug, error } from 'src/utils/logging';

export function applyTheme(theme: Tidy5eTheme) {
  try {
    const styleTagId = 'tidy5e-sheet-kgar-theme';
    let existingThemeStyle = document.getElementById(styleTagId);

    if (existingThemeStyle) {
      existingThemeStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `
    <style id="${styleTagId}">
      :root {
        ${Object.entries(theme.variables)
          .filter(([variable]) => variable in themeVariables)
          .map(([variable, value]) => `${variable}: ${value};`)
          .join('\n')}
      }
    </style>
    `
    );
  } catch (e) {
    console.error(e);
    debug(
      'Unable to apply Tidy 5e style tag; falling back to root style properties.'
    );
    Object.keys(themeVariables).forEach((variable) => {
      document.documentElement.style.setProperty(
        variable,
        theme.variables[variable] ?? null
      );
    });
  }
}
