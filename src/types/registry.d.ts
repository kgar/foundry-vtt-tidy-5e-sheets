import type {
  ActivityRowAction,
  ActorRowAction,
  AdvancementRowAction,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  ItemRowAction,
} from './types';

declare global {
  interface CONFIG {
    TIDY5E: {
      rowActions: TidyRowActionRegistry;
    };
  }
}

type TidyRowActionRegistry = {
  activity: Record<string, ActivityRowAction>;
  assignedCrew: Record<string, ActorRowAction>;
  containerContents: Record<string, ItemRowAction>;
  draftAnimal: Record<string, ActorRowAction>;
  effect: Record<string, EffectRowAction>;
  encounterCombatant: Record<string, EncounterCombatantMemberRowAction>;
  encounterMember: Record<string, ActorRowAction>;
  feature: Record<string, ItemRowAction>;
  groupMember: Record<string, ActorRowAction>;
  inventory: Record<string, ItemRowAction>;
  itemAdvancement: Record<string, AdvancementRowAction>;
  passenger: Record<string, ActorRowAction>;
  spell: Record<string, ItemRowAction>;
  unassignedCrew: Record<string, ActorRowAction>;
};

export type RowActionRegistryDomain = keyof CONFIG['TIDY5E']['rowActions'];

export type RowActionOf<D extends RowActionRegistryDomain> =
  CONFIG['TIDY5E']['rowActions'][D][keyof CONFIG['TIDY5E']['rowActions'][D]];
