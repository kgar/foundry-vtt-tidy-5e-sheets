import chroma from 'chroma-js';

export const TEXT_COLOR_LIGHT = '#ffffff'; // --t5e-color-palette-grey-100
export const TEXT_COLOR_DARK = '#000000'; // --t5e-color-palette-grey-0
export const THEME_CLASS_LIGHT = 'theme-light';
export const THEME_CLASS_DARK = 'theme-dark';

/**
 * APCA (Accessible Perceptual Contrast Algorithm) minimum contrast values.
 * APCA returns Lc (Lightness Contrast) values from approximately -108 to +106.
 * - Positive Lc: dark text on light background
 * - Negative Lc: light text on dark background
 *
 * Recommended minimums:
 * - 90+ : Preferred for body text
 * - 75  : Minimum for body text
 * - 60  : Large text / non-text UI elements
 * - 45  : Large headlines, pictograms
 * - 30  : Minimum for any text (placeholder, disabled)
 */

export type ContrastResult = {  /** Final color value in rgb() format */
  backgroundColor: string;
  wasBackgroundColorAdjusted: boolean;
  /** The theme this color represents (e.g. Light for background and light text) */
  themeClass: typeof THEME_CLASS_LIGHT | typeof THEME_CLASS_DARK;  /** The foreground (text) color that will be used */
  foregroundColor: string;
  wasForegroundColorAdjusted: boolean;
  contrastLc: number;
  passesContrast: boolean;
};

const APCA_BODY_HIGH_CONTRAST = 90;
const APCA_BODY_TEXT = 75;
const APCA_CONTENT_TEXT = 60;
const APCA_HEADLINE = 45;
const APCA_MINIMUM = 30;
export type ContrastLevel = 'body-high-contrast' | 'body' | 'large' | 'headline' | 'minimum';

export type ContrastOptions = {
  level?: ContrastLevel;
  /** Whether to auto-adjust the color if it fails contrast (default: true) */
  adjustBackgroundColor?: boolean;
  /** The text color to use (default: TEXT_COLOR_DARK) */
  adjustForegroundColor?: boolean;
};

/**
 * Gets the minimum APCA Lc value required for the given text size level
 */
function getMinContrastLc(level: ContrastLevel): number {
  switch (level) {
    case 'body-high-contrast':
      return APCA_BODY_HIGH_CONTRAST;
    case 'headline':
      return APCA_HEADLINE;
    case 'large':
      return APCA_CONTENT_TEXT;
    case 'minimum':
      return APCA_MINIMUM;
    case 'body':
    default:
      return APCA_BODY_TEXT;
  }
}

/**
 * Calculates the APCA contrast between foreground (text) and background colors.
 * Returns the absolute Lc value.
 */
function getContrastAPCA(foregroundColor: string, backgroundColor: string): number {
  try {
    const lc = chroma.contrastAPCA(foregroundColor, backgroundColor);
    return Math.abs(lc);
  } catch {
    return 0;
  }
}

function getBestForegroundColor(backgroundColor: string, foregroundColorDark?: string, foregroundColorLight?: string): {
  foregroundColor: string;
  themeClass: typeof THEME_CLASS_LIGHT | typeof THEME_CLASS_DARK;
  contrastLc: number;
} {
  if (!foregroundColorLight) { foregroundColorLight = TEXT_COLOR_LIGHT; }
  if (!foregroundColorDark) { foregroundColorDark = TEXT_COLOR_DARK; }

  const contrastWithLight = getContrastAPCA(foregroundColorLight, backgroundColor);
  const contrastWithDark = getContrastAPCA(foregroundColorDark, backgroundColor);

  if (contrastWithLight >= contrastWithDark) {
    return {
      foregroundColor: foregroundColorLight,
      themeClass: THEME_CLASS_DARK, // Dark theme = light text
      contrastLc: contrastWithLight,
    };
  }

  return {
    foregroundColor: foregroundColorDark,
    themeClass: THEME_CLASS_LIGHT, // Light theme = dark text
    contrastLc: contrastWithDark,
  };
}

/**
 * Adjusts a color to meet the minimum APCA contrast level, preserving hue and chroma. Set adjustingForeground if you're adjusting the foreground color.
 */
function adjustColorForContrast(
  colorToAdjust: string,
  referenceColor: string,
  minContrastLc: number,
  adjustingForeground: boolean = false
): string {
  try {
    const chromaColor = chroma(colorToAdjust);
    let [l, c, h] = chromaColor.lch();

    const measure = (testColor: chroma.Color) =>
      adjustingForeground
        ? getContrastAPCA(testColor.hex(), referenceColor)
        : getContrastAPCA(referenceColor, testColor.hex());

    // Search both directions and keep whichever reaches the target. Avoids the
    // dead-end where the starting color is at an extreme (e.g. white can't go
    // lighter) and a single fixed direction has zero headroom.
    const searchInDirection = (goLighter: boolean): { color: chroma.Color; lc: number } => {
      let minL = goLighter ? l : 0;
      let maxL = goLighter ? 100 : l;
      let bestColor = chromaColor;
      let bestLc = measure(chromaColor);

      for (let i = 0; i < 20; i++) {
        const midL = (minL + maxL) / 2;
        const testColor = Number.isNaN(h)
          ? chroma.lch(midL, c, 0)
          : chroma.lch(midL, c, h);
        const contrastLc = measure(testColor);

        if (contrastLc > bestLc) {
          bestColor = testColor;
          bestLc = contrastLc;
        }

        if (Math.abs(contrastLc - minContrastLc) < 1) {
          break;
        }

        if (contrastLc < minContrastLc) {
          if (goLighter) minL = midL; else maxL = midL;
        } else {
          if (goLighter) maxL = midL; else minL = midL;
        }
      }

      return { color: bestColor, lc: bestLc };
    };

    const lighter = searchInDirection(true);
    const darker = searchInDirection(false);
    const lighterMeets = lighter.lc >= minContrastLc;
    const darkerMeets = darker.lc >= minContrastLc;

    let adjustedColor: chroma.Color;
    if (lighterMeets && darkerMeets) {
      // Both directions work — pick the one closer to the original lightness
      // to minimize visual shift.
      adjustedColor =
        Math.abs(lighter.color.lch()[0] - l) <= Math.abs(darker.color.lch()[0] - l)
          ? lighter.color
          : darker.color;
    } else if (lighterMeets) {
      adjustedColor = lighter.color;
    } else if (darkerMeets) {
      adjustedColor = darker.color;
    } else {
      adjustedColor = lighter.lc >= darker.lc ? lighter.color : darker.color;
    }

    // Reduce chroma as a fallback if lightness alone wasn't enough
    const finalContrast = measure(adjustedColor);
    if (finalContrast < minContrastLc) {
      const reducedChroma = Math.max(0, c * 0.5);
      const [adjustedL] = adjustedColor.lch();
      adjustedColor = Number.isNaN(h)
        ? chroma.lch(adjustedL, reducedChroma, 0)
        : chroma.lch(adjustedL, reducedChroma, h);
    }

    return adjustedColor.css('rgb');
  } catch {
    try {
      return chroma(colorToAdjust).css('rgb');
    } catch {
      return colorToAdjust;
    }
  }
}

/**
 * Check a color and return APCA contrast information along with the appropriate
 * theme class to use. Can optionally adjust background and/or foreground colors
 * to meet contrast requirements.
 */
export function getColorWithContrast(
  backgroundColor: string,
  foregroundColor: string = TEXT_COLOR_DARK,
  options: ContrastOptions = {}
): ContrastResult {
  const { level = 'body', adjustBackgroundColor = true, adjustForegroundColor = false } = options;

  if (!chroma.valid(backgroundColor)) {
    return {
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      wasBackgroundColorAdjusted: false,
      wasForegroundColorAdjusted: false,
      contrastLc: 0,
      themeClass: THEME_CLASS_LIGHT,
      passesContrast: false,
    };
  }

  const minContrastLc = getMinContrastLc(level);
  const { foregroundColor: bestForegroundColor, themeClass, contrastLc } = getBestForegroundColor(backgroundColor, foregroundColor);
  const passesContrast = contrastLc >= minContrastLc;

  if (passesContrast || (!adjustBackgroundColor && !adjustForegroundColor)) {
    return {
      backgroundColor: chroma(backgroundColor).css('rgb'),
      foregroundColor: chroma(bestForegroundColor).css('rgb'),
      wasBackgroundColorAdjusted: false,
      wasForegroundColorAdjusted: false,
      contrastLc,
      themeClass,
      passesContrast,
    };
  }

  let adjustedBackgroundColor = backgroundColor;
  let adjustedForegroundColor = bestForegroundColor;
  if (adjustBackgroundColor) {
    adjustedBackgroundColor = adjustColorForContrast(backgroundColor, bestForegroundColor, minContrastLc, false);
  }
  if (adjustForegroundColor) {
    adjustedForegroundColor = adjustColorForContrast(bestForegroundColor, backgroundColor, minContrastLc, true);
  }
  const adjustedContrastLc = getContrastAPCA(adjustedForegroundColor, adjustedBackgroundColor);

  return {
    backgroundColor: adjustedBackgroundColor,
    foregroundColor: adjustedForegroundColor,
    wasBackgroundColorAdjusted: adjustBackgroundColor,
    wasForegroundColorAdjusted: adjustForegroundColor,
    contrastLc: adjustedContrastLc,
    themeClass,
    passesContrast: adjustedContrastLc >= minContrastLc,
  };
}

/**
 * Get a valid foreground color given a background color and target contrast level.
 */
export function getForegroundAtContrast(
  backgroundColor: string,
  foregroundColor: string,
  targetLevel: ContrastLevel,
  preserveChroma?: boolean,
): string {
  const targetLc = getMinContrastLc(targetLevel);

  try {
    if (!chroma.valid(backgroundColor) || !chroma.valid(foregroundColor)) {
      return foregroundColor;
    }
    const currentContrast = getContrastAPCA(foregroundColor, backgroundColor);
    if (currentContrast >= targetLc) {
      return chroma(foregroundColor).css('rgb');
    }

    let adjusted = adjustColorForContrast(foregroundColor, backgroundColor, targetLc, true);

    if (preserveChroma) {
      // Override to keep saturation for colors like highlights
      const [, originalChroma, originalHue] = chroma(foregroundColor).oklch();
      const [adjustedL] = chroma(adjusted).oklch();
      adjusted = chroma
        .oklch(adjustedL, originalChroma, Number.isNaN(originalHue) ? 0 : originalHue)
        .css('rgb');
    }

    return adjusted;
  } catch {
    return foregroundColor;
  }
}

/**
 * Checks APCA contrast of a color against both light and dark text colors. uses defaults if not provided.
 */
export function checkContrastBoth(
  backgroundColor: string,
  darkTextColor?: string,
  lightTextColor?: string,
  options: Pick<ContrastOptions, 'level'> = {}
): {
  passesWithLightText: boolean;
  passesWithDarkText: boolean;
  contrastWithLight: number;
  contrastWithDark: number;
  minRequired: number;
} {
  const { level = 'body' } = options;
  const minContrastLc = getMinContrastLc(level);

  if (!lightTextColor) {lightTextColor = TEXT_COLOR_LIGHT; }
  if (!darkTextColor) { darkTextColor = TEXT_COLOR_DARK; }

  if (!chroma.valid(backgroundColor)) {
    return {
      passesWithLightText: false,
      passesWithDarkText: false,
      contrastWithLight: 0,
      contrastWithDark: 0,
      minRequired: minContrastLc,
    };
  }

  const contrastWithLight = getContrastAPCA(lightTextColor, backgroundColor);
  const contrastWithDark = getContrastAPCA(darkTextColor, backgroundColor);

  return {
    passesWithLightText: contrastWithLight >= minContrastLc,
    passesWithDarkText: contrastWithDark >= minContrastLc,
    contrastWithLight,
    contrastWithDark,
    minRequired: minContrastLc,
  };
}
