import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { isNil } from './data';

/**
 * An Handlebars helper to format numbers
 *
 * @param value    - The string or number to format
 * @param options  - Options for how the number should be formatted
 */
export function formatAsModifier(value: string | number): string {
  const data = getModifierData(value);
  return `${data.sign}${data.value}`;
}

/**
 * @param values maybe string values that can be coalesced to fallbacks
 * @returns the first truthy, non-empty string value
 */
export function coalesce(...values: (string | null | undefined)[]) {
  for (let value of values) {
    if (!isNil(value?.trim(), '')) {
      return value;
    }
  }

  return '';
}

export function getModifierData(value: string | number): {
  sign: string;
  value: string;
} {
  const emptyMod = {
    sign: '+',
    value: '0',
  };

  if (value === null || value === undefined) {
    return emptyMod;
  }

  const parsed = typeof value === 'string' ? +value : value;

  if (isNaN(parsed)) {
    return emptyMod;
  }

  return {
    sign: parsed < 0 ? '-' : '+',
    value: Math.abs(parsed).toString(),
  };
}
