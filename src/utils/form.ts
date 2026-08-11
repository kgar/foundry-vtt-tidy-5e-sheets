import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function processInputChangeDelta(
  value: string,
  entity: unknown,
  field: string,
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
  originalValue: unknown,
) {
  if (['+', '-'].includes(newValue[0])) {
    const delta = parseFloat(newValue);
    return Number(originalValue) + delta;
  } else if (newValue[0] === '=') {
    return Number(newValue.slice(1));
  }
  return Number(newValue);
}

export function applyNumberInputConstraints(
  value: number,
  input: HTMLElement | null | undefined,
) {
  if (!input) {
    return value;
  }

  const min = Number.isNumeric(input.dataset.min)
    ? Number(input.dataset.min)
    : -Infinity;
  const max = Number.isNumeric(input.dataset.max)
    ? Number(input.dataset.max)
    : Infinity;

  return Math.clamp(value, min, max);
}

export function getSpecializedUpdateInformation(
  datasetName: string | null | undefined,
) {
  const delimiterIndex = datasetName?.indexOf(':') ?? -1;

  if (delimiterIndex < 0) {
    return {
      prop: datasetName,
      prefix: undefined,
    };
  }

  return {
    prop: datasetName?.substring(delimiterIndex + 1),
    operationType: datasetName?.substring(0, delimiterIndex),
  };
}
