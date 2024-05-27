import type { ItemSheetContext } from 'src/types/item.types';

export function mapPropertiesToSave(
  context: ItemSheetContext,
  ev: Event & { currentTarget: HTMLInputElement },
  keyToSave: string
) {
  const allProperties = context.properties;

  const propertiesToSave = Object.entries(allProperties)
    .filter(
      ([key, value]: [string, any]) =>
        key !== keyToSave &&
        value.selected &&
        !context.itemOverrides.has(`system.properties.${key}`)
    )
    .map(([key, _]) => key);

  if (ev.currentTarget.checked) {
    propertiesToSave.push(keyToSave);
  }

  return {
    'system.properties': propertiesToSave,
  };
}
