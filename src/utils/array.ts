export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
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
