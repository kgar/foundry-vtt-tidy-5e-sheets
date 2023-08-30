import type { Tidy5eTheme as Tidy5eTheme } from 'src/types/theme';
import { themeVariables } from './theme-reference';

export function applyTheme(theme: Tidy5eTheme) {
  Object.keys(themeVariables).forEach((variable) => {
    document.documentElement.style.setProperty(
      variable,
      theme.variables[variable] ?? null
    );
  });
}
