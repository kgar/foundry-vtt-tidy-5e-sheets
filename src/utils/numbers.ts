export function isRealNumber(inNumber: number | undefined | null): boolean {
  return (
    inNumber !== undefined &&
    inNumber !== null &&
    !isNaN(inNumber) &&
    typeof inNumber === 'number' &&
    isFinite(inNumber)
  );
}
