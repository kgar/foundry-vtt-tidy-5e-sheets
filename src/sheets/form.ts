import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { warn } from 'src/utils/logging';

function processInputChangeDelta(
  event: Event & { currentTarget: HTMLInputElement },
  entity: unknown,
  field: string
) {
  const value = event.currentTarget.value;

  if (['+', '-'].includes(value[0])) {
    const delta = parseFloat(value);
    return Number(FoundryAdapter.getProperty(entity, field)) + delta;
  } else if (value[0] === '=') {
    return Number(value.slice(1));
  }
  return Number(value);
}

/*
  dtype "Number" parseInt(value)
  dtype "Boolean" value === "true"
*/

export async function submitText(
  event: Event & { currentTarget: HTMLInputElement },
  entity: { update: (obj: Record<string, unknown>) => Promise<unknown> },
  field: string
) {
  if (
    event.currentTarget.type !== 'text' &&
    event.currentTarget.type !== 'hidden'
  ) {
    return Promise.reject(
      "Unable to save changes for input. It is not of type 'text' or 'hidden.' Other input types are not support by 'submitText.'"
    );
  }

  let value: string | number | boolean = event.currentTarget.value;

  if (event.currentTarget.dataset.dtype === 'Number') {
    value = processInputChangeDelta(event, entity, field);
  }

  if (event.currentTarget.dataset.dtype === 'Boolean') {
    value = value === 'true';
  }

  return entity.update({
    [field]: value ?? null,
  });
}

export function submitCheckbox() {}
