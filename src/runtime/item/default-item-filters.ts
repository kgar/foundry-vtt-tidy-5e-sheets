import type { ItemFilter } from '../types';

export const defaultItemFilters = {
  action: {
    name: 'action',
    predicate: (item) => item.system.activation?.type === 'action',
    text: 'DND5E.Action',
    group: 'DND5E.ItemActivationCost',
  },
  bonus: {
    name: 'bonus',
    predicate: (item) => item.system.activation?.type === 'bonus',
    text: 'DND5E.BonusAction',
    group: 'DND5E.ItemActivationCost',
  },
  reaction: {
    name: 'reaction',
    predicate: (item) => item.system.activation?.type === 'reaction',
    text: 'DND5E.Reaction',
    group: 'DND5E.ItemActivationCost',
  },
  ritual: {
    name: 'ritual',
    predicate: (item) => item.system.components?.ritual === true,
    text: 'DND5E.Ritual',
    group: 'DND5E.SpellComponents',
  },
  concentration: {
    name: 'concentration',
    predicate: (item) => item.system.components?.concentration === true,
    text: 'DND5E.Concentration',
    group: 'DND5E.SpellComponents',
  },
  verbal: {
    name: 'verbal',
    predicate: (item) => item.system.components?.verbal === true,
    text: 'DND5E.ComponentVerbal',
    group: 'DND5E.SpellComponents',
  },
  somatic: {
    name: 'somatic',
    predicate: (item) => item.system.components?.somatic === true,
    text: 'DND5E.ComponentSomatic',
    group: 'DND5E.SpellComponents',
  },
  material: {
    name: 'material',
    predicate: (item) => item.system.components?.material === true,
    text: 'DND5E.ComponentMaterial',
    group: 'DND5E.SpellComponents',
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
    group: 'DND5E.SpellPreparationMode',
  },
  equipped: {
    name: 'equipped',
    predicate: (item) => item.system.equipped === true,
    text: 'DND5E.Equipped',
    group: 'TIDY5E.ItemFilters.Group.Miscellaneous',
  },
} as const satisfies Record<string, ItemFilter>;
