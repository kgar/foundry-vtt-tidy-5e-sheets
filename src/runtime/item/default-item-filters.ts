import { CONSTANTS } from 'src/constants';
import type { FilterCategoriesToFilters, ItemFilter } from './item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SpellUtils } from 'src/utils/SpellUtils';
import { ItemUtils } from 'src/utils/ItemUtils';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';

export const defaultItemFilters: Record<string, ItemFilter> = {
  activationCostAction: {
    name: 'activationCostAction',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_ACTION
      ),
    text: 'DND5E.Action',
  },
  activationCostBonus: {
    name: 'activationCostBonus',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_BONUS
      ),
    text: 'DND5E.BonusAction',
  },
  activationCostReaction: {
    name: 'activationCostReaction',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_REACTION
      ),
    text: 'DND5E.Reaction',
  },
  activationCostLegendary: {
    name: 'activationCostLegendary',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_LEGENDARY
      ),
    text: 'DND5E.LegendaryAction.Label',
  },
  activationCostMythic: {
    name: 'activationCostMythic',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_MYTHIC
      ),
    text: 'DND5E.MythicActionLabel',
  },
  activationCostLair: {
    name: 'activationCostLair',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_LAIR
      ),
    text: 'DND5E.LAIR.Action.Label',
  },
  activationCostCrew: {
    name: 'activationCostCrew',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_CREW
      ),
    text: 'DND5E.VehicleCrewAction',
  },
  activationCostSpecial: {
    name: 'activationCostSpecial',
    predicate: (item) =>
      !!item.system.activities?.some(
        (a: any) => a.activation?.type === CONSTANTS.ACTIVATION_COST_SPECIAL
      ),
    text: 'DND5E.Special',
  },
  activationCostOther: {
    name: 'activationCostOther',
    predicate: (item) =>
      !!item.system.activities?.every(
        (a: any) =>
          ![
            CONSTANTS.ACTIVATION_COST_ACTION,
            CONSTANTS.ACTIVATION_COST_BONUS,
            CONSTANTS.ACTIVATION_COST_REACTION,
          ].includes(a.activation?.type)
      ),
    text: 'TIDY5E.ItemFilters.Filter.Other',
  },
  magical: {
    name: 'magical',
    predicate: (item) => !!item.system?.properties?.has('mgc'),
    text: 'DND5E.ITEM.Property.Magical',
  },
  ritual: {
    name: 'ritual',
    predicate: (item) => item.system.properties?.has('ritual') === true,
    text: 'DND5E.Ritual',
  },
  concentration: {
    name: 'concentration',
    predicate: (item) => item.system.properties?.has('concentration') === true,
    text: 'DND5E.Concentration',
    abbreviation: 'DND5E.AbbreviationConc',
    pinnedFilterClass: 'hide-under-400',
  },
  verbal: {
    name: 'verbal',
    predicate: (item) => item.system.properties?.has('vocal') === true,
    text: 'DND5E.ComponentVerbal',
  },
  somatic: {
    name: 'somatic',
    predicate: (item) => item.system.properties?.has('somatic') === true,
    text: 'DND5E.ComponentSomatic',
  },
  material: {
    name: 'material',
    predicate: (item) => item.system.properties?.has('material') === true,
    text: 'DND5E.ComponentMaterial',
  },
  prepared: {
    name: 'prepared',
    predicate: (item) => {
      const isPreparedCantrip =
        SpellUtils.isCantrip(item) && SpellUtils.isCantripPrepared(item);

      return (
        isPreparedCantrip ||
        SpellUtils.isAlwaysPrepared(item) ||
        SpellUtils.isInnate(item) ||
        SpellUtils.isPrepared(item)
      );
    },
    text: 'DND5E.Prepared',
  },
  canCastSpell: {
    name: 'canCastSpell',
    predicate: (item) => {
      return (
        item.type === CONSTANTS.ITEM_TYPE_SPELL &&
        (SpellUtils.isCastableCantrip(item) || SpellUtils.isCastableSpell(item))
      );
    },
    text: 'TIDY5E.ItemFilters.CanCast',
  },
  canUse: {
    name: 'canUse',
    predicate: (item) => ItemUtils.canUse(item),
    text: 'TIDY5E.ItemFilters.CanUse',
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
        predicate: (item) =>
          !FoundryAdapter.concealDetails(item) && item.system.rarity === key,
        text: text,
      } satisfies ItemFilter)
  );
}

export function getSpellcastingClassFilters(actor: Actor5e): ItemFilter[] {
  return Object.entries<Item5e>(actor.spellcastingClasses).map(
    ([key, item]) => {
      return {
        name: key,
        predicate: (item) => item.system.sourceClass === key,
        text:
          item.system.spellcasting.progression === item.spellcasting.progression
            ? item.name
            : item.subclass?.name,
      };
    }
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
  const spellSchools = CONFIG.DND5E.spellSchools as Record<string, any>;

  return Object.entries(spellSchools).map<ItemFilter>(
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
      name: 'attunement-optional',
      predicate: (item) =>
        !FoundryAdapter.concealDetails(item) &&
        item.system.attunement === CONSTANTS.ATTUNEMENT_OPTIONAL,
      text: CONFIG.DND5E.attunementTypes[CONSTANTS.ATTUNEMENT_OPTIONAL],
    },
    {
      name: 'attunement-required',
      predicate: (item) =>
        !FoundryAdapter.concealDetails(item) &&
        item.system.attunement === CONSTANTS.ATTUNEMENT_REQUIRED,
      text: CONFIG.DND5E.attunementTypes[CONSTANTS.ATTUNEMENT_REQUIRED],
    },
    {
      name: 'attuned',
      predicate: (item) =>
        !FoundryAdapter.concealDetails(item) &&
        !!CONFIG.DND5E.attunementTypes[
          item.system.attunement as keyof typeof CONFIG.DND5E.attunementTypes
        ] &&
        item.system.attuned,
      text: 'DND5E.AttunementAttuned',
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
    'DND5E.SpellComponents': [
      defaultItemFilters.verbal,
      defaultItemFilters.somatic,
      defaultItemFilters.material,
      defaultItemFilters.concentration,
      defaultItemFilters.ritual,
    ],
    'DND5E.SpellPreparation.Mode': [
      defaultItemFilters.prepared,
      defaultItemFilters.canCastSpell,
    ],
    'DND5E.SpellSchool': () => getSpellSchoolFilters(),
  };
}

export function getActionListFilterCategories(): FilterCategoriesToFilters {
  return {
    'DND5E.ItemActivationCost': [
      defaultItemFilters.activationCostAction,
      defaultItemFilters.activationCostBonus,
      defaultItemFilters.activationCostReaction,
      defaultItemFilters.activationCostLegendary,
      defaultItemFilters.activationCostMythic,
      defaultItemFilters.activationCostLair,
      defaultItemFilters.activationCostCrew,
      defaultItemFilters.activationCostSpecial,
    ],
    ...getStandardSpellSchoolFilterCategories(),
  };
}
