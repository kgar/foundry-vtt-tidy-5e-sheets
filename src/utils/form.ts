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

const NUMERIC_INPUT_SELECTOR =
  '[data-dtype="Number"], [inputmode="numeric"], [type="number"]';

/**
 * A target element is opted into form change handling (name or data-name)
 * and has indicated that it is numeric, whether by type or by
 * metadata.
 *
 * @returns `true` if the input should be parsed and adjusted for delta changes; else `false`
 */
export function shouldParseInputDelta(target: HTMLElement) {
  return target.matches(
    `input:is([name], [data-name]):is(${NUMERIC_INPUT_SELECTOR})`,
  );
}

/**
 * A target element has indicated that it is numeric, whether by type or by
 * metadata.
 * 
 * @returns `true` if the input is considered numeric in nature; else `false`
 */
export function isNumericInput(target: HTMLElement) {
  return target.matches(NUMERIC_INPUT_SELECTOR);
}
