import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function processInputChangeDelta(
  value: string,
  entity: unknown,
  field: string
) {
  if (['+', '-'].includes(value[0])) {
    const delta = parseFloat(value);
    return Number(FoundryAdapter.getProperty(entity, field)) + delta;
  } else if (value[0] === '=') {
    return Number(value.slice(1));
  }
  return Number(value);
}

export function processInputChangeDeltaFromValues(
  newValue: string,
  originalValue: unknown
) {
  if (['+', '-'].includes(newValue[0])) {
    const delta = parseFloat(newValue);
    return Number(originalValue) + delta;
  } else if (newValue[0] === '=') {
    return Number(newValue.slice(1));
  }
  return Number(newValue);
}