import type {
  ItemSheetQuadroneContext,
} from 'src/types/item.types';

// TODO: Eliminate these specific mappers for more generalized versions, as needed.
export function mapPropertiesToSave(
  context: ItemSheetQuadroneContext,
  ev: Event & { currentTarget: HTMLInputElement },
  keyToSave: string
) {
  const allProperties = context.properties;

  const propertiesToSave = allProperties.options
    .filter((property) => property.value !== keyToSave && property.selected)
    .map((property) => property.value);

  if (ev.currentTarget.checked) {
    propertiesToSave.push(keyToSave);
  }

  return {
    'system.properties': propertiesToSave,
  };
}

// TODO: Eliminate these specific mappers for more generalized versions, as needed.
export function mapMulticlassingAbilitiesToSave(
  context: ItemSheetQuadroneContext,
  ev: Event & { currentTarget: HTMLInputElement }
) {
  const selectedAbilities: Set<string> = new Set<string>(
    context.system.primaryAbility.value
  );

  if (ev.currentTarget.checked) {
    selectedAbilities.add(ev.currentTarget.value);
  } else {
    selectedAbilities.delete(ev.currentTarget.value);
  }

  return {
    'system.primaryAbility.value': selectedAbilities,
  };
}

// TODO: Eliminate these specific mappers for more generalized versions, as needed.
export function mapSystemDamageTypesToSave(
  prefix: string,
  source: any,
  ev: Event & { currentTarget: HTMLInputElement }
) {
  const selectedAbilities: Set<string> = new Set<string>(source.types);

  if (ev.currentTarget.checked) {
    selectedAbilities.add(ev.currentTarget.value);
  } else {
    selectedAbilities.delete(ev.currentTarget.value);
  }

  return {
    [`${prefix}types`]: selectedAbilities,
  };
}
