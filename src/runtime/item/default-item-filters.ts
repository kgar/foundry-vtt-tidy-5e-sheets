import type { ItemFilter } from './item.types';

export const defaultItemFilters = {
  action: {
    name: 'action',
    predicate: (item) => item.system.activation?.type === 'action',
    text: 'DND5E.Action',
  },
  bonus: {
    name: 'bonus',
    predicate: (item) => item.system.activation?.type === 'bonus',
    text: 'DND5E.BonusAction',
  },
  reaction: {
    name: 'reaction',
    predicate: (item) => item.system.activation?.type === 'reaction',
    text: 'DND5E.Reaction',
  },
  ritual: {
    name: 'ritual',
    predicate: (item) => item.system.properties.has('ritual'),
    text: 'DND5E.Ritual',
  },
  concentration: {
    name: 'concentration',
    predicate: (item) => item.system.properties.has('concentration'),
    text: 'DND5E.Concentration',
  },
  verbal: {
    name: 'verbal',
    predicate: (item) => item.system.properties.has('vocal'),
    text: 'DND5E.ComponentVerbal',
  },
  somatic: {
    name: 'somatic',
    predicate: (item) => item.system.properties.has('somatic'),
    text: 'DND5E.ComponentSomatic',
  },
  material: {
    name: 'material',
    predicate: (item) => item.system.properties.has('material'),
    text: 'DND5E.ComponentMaterial',
  },
  prepared: {
    name: 'prepared',
    predicate: (item) => {
      return (
        item.system.level === 0 ||
        ['innate', 'always'].includes(item.system.preparation.mode) ||
        item.actor?.type === 'npc' ||
        item.system.preparation.prepared
      );
    },
    text: 'DND5E.Prepared',
  },
  equipped: {
    name: 'equipped',
    predicate: (item) => item.system.equipped === true,
    text: 'DND5E.Equipped',
  },
} as const satisfies Record<string, ItemFilter>;

export function getItemRarityFilters(): ItemFilter[] {
  const itemRarity = CONFIG.DND5E.itemRarity as Record<string, string>;

  return Object.entries(itemRarity).map<ItemFilter>(
    ([key, text]) =>
      ({
        name: key,
        predicate: (item) => item.system.rarity === key,
        text: text,
      } satisfies ItemFilter)
  );
}

export function getItemRarityFiltersAsObject(): Record<string, ItemFilter> {
  return getItemRarityFilters().reduce<Record<string, ItemFilter>>(
    (prev, curr) => {
      prev[curr.name] = curr;
      return prev;
    },
    {}
  );
}

export function getSpellSchoolFilters(): ItemFilter[] {
  const itemRarity = CONFIG.DND5E.spellSchools as Record<string, any>;

  return Object.entries(itemRarity).map<ItemFilter>(
    ([key, schoolData]) =>
      ({
        name: key,
        predicate: (item) => item.system.school === key,
        text: schoolData.label,
      } satisfies ItemFilter)
  );
}

export function getSpellSchoolFiltersAsObject(): Record<string, ItemFilter> {
  return getSpellSchoolFilters().reduce<Record<string, ItemFilter>>(
    (prev, curr) => {
      prev[curr.name] = curr;
      return prev;
    },
    {}
  );
}

export function getAttunementFilters(): ItemFilter[] {
  return [
    {
      name: 'attunement-required',
      predicate: (item) => item.system.attunement === 1,
      text: CONFIG.DND5E.attunements[1],
    },
    {
      name: 'attuned',
      predicate: (item) => item.system.attunement === 2,
      text: CONFIG.DND5E.attunements[2],
    },
  ];
}

export function getAttunementFiltersAsObject(): Record<string, ItemFilter> {
  return getAttunementFilters().reduce<Record<string, ItemFilter>>(
    (prev, curr) => {
      prev[curr.name] = curr;
      return prev;
    },
    {}
  );
}
