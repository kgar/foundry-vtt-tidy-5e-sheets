import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export function processInputChangeDelta(
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
