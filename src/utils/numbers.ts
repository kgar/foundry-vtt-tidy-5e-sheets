export function isRealNumber(inNumber: number | undefined | null): boolean {
  return (
    inNumber !== undefined &&
    inNumber !== null &&
    !isNaN(inNumber) &&
    typeof inNumber === 'number' &&
    isFinite(inNumber)
  );
}

export function clamp<T extends number>(num: T, min: T, max: T) {
  return Math.min(Math.max(num, min), max);
}
