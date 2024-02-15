import type { ItemFilter } from '../types';

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
    predicate: (item) => item.system.components?.verbal === true,
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
