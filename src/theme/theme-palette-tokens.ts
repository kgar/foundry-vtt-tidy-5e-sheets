import chroma from 'chroma-js';
import { THEME_CLASS_DARK, THEME_CLASS_LIGHT } from './theme-color-functions';

type ThemeVariant = typeof THEME_CLASS_LIGHT | typeof THEME_CLASS_DARK;

// Manual copy of our theme tokens for APCA contrast adjustment. 
// Manually synced with variables-quadrone 🥲

// Foregrounds are not overridden in .theme-dark
export const BASE_THEME_FOREGROUNDS = {
  foreground: 'rgb(255, 255, 255)', // grey-100
  foregroundDiminished: 'rgb(178, 178, 178)', // grey-70
  foregroundDisabled: 'rgb(122, 122, 122)', // grey-48
  foregroundDarker: 'rgb(255, 255, 255)', // grey-100
  foregroundDarkerDiminished: 'rgb(178, 178, 178)', // grey-70
  foregroundDarkerDisabled: 'rgb(122, 122, 122)', // grey-48
} as const;

// Card colors ARE overridden in .theme-dark and we need both.
export const BASE_CARD_COLOR: Record<ThemeVariant, string> = {
  [THEME_CLASS_LIGHT]: 'rgb(248, 244, 241)',
  [THEME_CLASS_DARK]: 'rgb(40, 42, 48)',
};

// Replicates theme color CSS adjustments in variables-quadrone
export function deriveDarkerAccent(accent: string): string {
  try {
    const [l, c, h] = chroma(accent).oklch();
    return chroma
      .oklch(l * 0.85, c * 1.2, Number.isNaN(h) ? 0 : h)
      .css('rgb');
  } catch {
    return accent;
  }
}
