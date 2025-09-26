import { clamp } from './numbers';

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

export type ArrayTransferParams = {
  arrFrom: any[];
  arrTo: any[];
  arrFromIndex: number;
  arrToIndex: number;
};

export function arrayTransfer({
  arrFrom,
  arrTo,
  arrFromIndex,
  arrToIndex,
}: ArrayTransferParams) {
  arrTo.push(...arrFrom.splice(arrFromIndex, 1));

  const toIndex = clamp(arrToIndex, 0, arrTo.length - 1);
  arrayMove(arrTo, arrTo.length - 1, toIndex);
}

/**
 * Split a semi-colon-separated list and clean out any empty entries.
 * @param {string} input
 * @returns {string[]}
 */
export function splitSemicolons(input: string): string[] {
  return input
    .split(';')
    .map((t) => t.trim())
    .filter((t) => t);
}

/**
 * Returns a random item for a given ArrayLike
 * @template T Array element
 * @param {Array<T>} input
 * @param {number | undefined} random an optional static value to use in place of a random number generation
 * @returns {T}
 */
export function randomItem<T>(arr: ArrayLike<T>, random?: number): T {
  return arr[Math.floor(arr.length * (random ?? Math.random()))];
}
