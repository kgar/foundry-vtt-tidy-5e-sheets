import { THEME_CLASS_DARK, THEME_CLASS_LIGHT } from './theme-color-functions';
import { debug } from 'src/utils/logging';

type ThemeVariant = typeof THEME_CLASS_LIGHT | typeof THEME_CLASS_DARK;

const imps: Partial<Record<ThemeVariant, HTMLElement>> = {};

function getCSSVariableImp(variant: ThemeVariant): HTMLElement {
  let imp = imps[variant];
  if (imp?.isConnected) {
    return imp;
  }

  imp = document.createElement('div');
  imp.className = `tidy5e-sheet quadrone ${variant}`;
  imp.setAttribute('aria-hidden', 'true');
  imp.style.cssText =
    'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;';
  document.body.appendChild(imp);
  imps[variant] = imp;
  return imp;
}

/**
 * Get CSS variables from the live sheet.
 */
export function getCSSVariable(
  variableName: string,
  variant: ThemeVariant = THEME_CLASS_LIGHT,
  resolveColor: boolean = false,
  overrides?: Record<string, string>
): string {
  const name = variableName.startsWith('--') ? variableName : `--${variableName}`;
  const imp = getCSSVariableImp(variant);

  if (overrides) {
    for (const [prop, val] of Object.entries(overrides)) {
      imp.style.setProperty(prop, val);
    }
  }

  const value = getComputedStyle(imp).getPropertyValue(name).trim();

  if (resolveColor && value) {
    imp.style.backgroundColor = value;
    const resolved = getComputedStyle(imp).backgroundColor;
    imp.style.backgroundColor = '';

    if (overrides) {
      for (const prop of Object.keys(overrides)) {
        imp.style.removeProperty(prop);
      }
    }

    debug(`getCSSVariable: ${variableName} = ${resolved} (resolved from ${value})`);
    return resolved;
  }

  if (overrides) {
    for (const prop of Object.keys(overrides)) {
      imp.style.removeProperty(prop);
    }
  }

  debug(`getCSSVariable: ${variableName} = ${value}`);
  return value;
}

/** Drop any cached probe elements — call when the DOM is being torn down. */
export function banishCSSVariableImps(): void {
  for (const variant of Object.keys(imps) as ThemeVariant[]) {
    imps[variant]?.remove();
    delete imps[variant];
  }
}
