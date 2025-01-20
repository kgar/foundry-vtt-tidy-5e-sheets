import { FoundryAdapter } from "src/foundry/foundry-adapter";
import { isNil } from "./data";

/**
 * An Handlebars helper to format numbers
 *
 * @param value    - The string or number to format
 * @param options  - Options for how the number should be formatted
 */
export function formatAsModifier(value: string | number): string {
  if (value === null || value === undefined) {
    return toSignedNumberString(0);
  }

  const parsed = typeof value === 'string' ? +value : value;

  if (isNaN(parsed)) {
    return toSignedNumberString(0);
  }

  return toSignedNumberString(parsed);
}

function toSignedNumberString(value: number) {
  return value.toLocaleString(FoundryAdapter.getCurrentLang(), { signDisplay: 'always' });
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