import type { Item5e } from 'src/types/item.types';
import type { PropertyEntry } from './properties.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class ItemProperties {
  static getAdditionalItemProperties(item: Item5e): PropertyEntry[] {
    switch (item.type) {
      case 'spell':
        return getSpellItemProperties(item);
    }

    return [];
  }
}

function getSpellItemProperties(item: Item5e): PropertyEntry[] {
  let entries: PropertyEntry[] = [];

  let labels = item.labels;

  entries.push({
    label: FoundryAdapter.localize('DND5E.SpellCastTime'),
    value: labels.activation,
  });

  entries.push({
    label: FoundryAdapter.localize('DND5E.Range'),
    value: labels.range,
  });

  if (labels.target) {
    entries.push({
      label: FoundryAdapter.localize('DND5E.Target'),
      value: labels.target,
    });
  }

  entries.push({
    label: FoundryAdapter.localize('DND5E.Duration'),
    value: labels.concentrationDuration,
  });

  return entries;
}
