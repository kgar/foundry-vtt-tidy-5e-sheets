const filterCycle = [null, true, false] as const;

export function cycleNullTrueFalseForward(currentValue: boolean | null) {
  const currentValueIndex = filterCycle.indexOf(currentValue);
  return filterCycle[(currentValueIndex + 1) % filterCycle.length];
}

export function cycleNullTrueFalseBackward(currentValue: boolean | null) {
  const currentValueIndex = filterCycle.indexOf(currentValue);
  return filterCycle.at(currentValueIndex - 1) ?? null;
}
