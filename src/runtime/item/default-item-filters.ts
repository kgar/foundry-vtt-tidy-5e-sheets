import { CONSTANTS } from 'src/constants';
import type { FilterCategoriesToFilters, ItemFilter } from './item.types';

export const defaultItemFilters = {
  activationCostAction: {
    name: 'activationCostAction',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_ACTION,
    text: 'DND5E.Action',
  },
  activationCostBonus: {
    name: 'activationCostBonus',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_BONUS,
    text: 'DND5E.BonusAction',
  },
  activationCostReaction: {
    name: 'activationCostReaction',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_REACTION,
    text: 'DND5E.Reaction',
  },
  activationCostLegendary: {
    name: 'activationCostLegendary',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_LEGENDARY,
    text: 'DND5E.LegendaryActionLabel',
  },
  activationCostMythic: {
    name: 'activationCostMythic',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_MYTHIC,
    text: 'DND5E.MythicActionLabel',
  },
  activationCostLair: {
    name: 'activationCostLair',
    predicate: (item) =>
      item.system.activation?.type === CONSTANTS.ACTIVATION_COST_LAIR,
    text: 'DND5E.LairActionLabel',
  },
  activationCostOther: {
    name: 'activationCostOther',
    predicate: (item) =>
      ![
        CONSTANTS.ACTIVATION_COST_ACTION,
        CONSTANTS.ACTIVATION_COST_BONUS,
        CONSTANTS.ACTIVATION_COST_REACTION,
      ].includes(item.system.activation?.type),
    text: 'TIDY5E.ItemFilters.Filter.Other',
  },
  ritual: {
    name: 'ritual',
    predicate: (item) => item.system.components?.ritual === true,
    text: 'DND5E.Ritual',
  },
  concentration: {
    name: 'concentration',
    predicate: (item) => item.system.components?.concentration === true,
    text: 'DND5E.Concentration',
  },
  verbal: {
    name: 'verbal',
    predicate: (item) => item.system.components?.vocal === true,
    text: 'DND5E.ComponentVerbal',
  },
  somatic: {
    name: 'somatic',
    predicate: (item) => item.system.components?.somatic === true,
    text: 'DND5E.ComponentSomatic',
  },
  material: {
    name: 'material',
    predicate: (item) => item.system.components?.material === true,
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
  const itemRarity = CONFIG.DND5E.spellSchools as Record<string, string>;

  return Object.entries(itemRarity).map<ItemFilter>(
    ([key, text]) =>
      ({
        name: key,
        predicate: (item) => item.system.school === key,
        text: text,
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

export function getStandardSpellSchoolFilterCategories(): FilterCategoriesToFilters {
  return {
    'DND5E.ItemActivationCost': [
      defaultItemFilters.activationCostAction,
      defaultItemFilters.activationCostBonus,
      defaultItemFilters.activationCostReaction,
      defaultItemFilters.activationCostOther,
    ],
    'DND5E.SpellComponents': [
      defaultItemFilters.verbal,
      defaultItemFilters.somatic,
      defaultItemFilters.material,
      defaultItemFilters.concentration,
      defaultItemFilters.ritual,
    ],
    'DND5E.SpellPreparationMode': [defaultItemFilters.prepared],
    'DND5E.SpellSchool': () => getSpellSchoolFilters(),
  };
}
