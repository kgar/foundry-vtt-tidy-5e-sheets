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

export function getPercentage(
  value: number | null | undefined,
  max: number | null | undefined
) {
  max ??= 0;
  value ??= 0;

  if (max <= 0) {
    return 0;
  }

  const percentage = Math.ceil((value / max) * 100);

  return clamp(percentage, 0, 100);
}

export function toNumber(str: string) {
  if (str.includes('/')) {
    const pieces = str.split('/');
    return parseInt(pieces[0]) / parseInt(pieces[1]);
  }
  return +str;
}

export function isLessThanOneIsOne(inNumber: number) {
  return inNumber < 1 ? 1 : inNumber;
}
