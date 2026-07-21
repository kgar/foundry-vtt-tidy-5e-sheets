import type { Component } from 'svelte';
import type {
  ActivityRowAction,
  ActorRowAction,
  AdvancementRowAction,
  CrewRowAction,
  DraftAnimalRowAction,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  EncounterMemberRowAction,
  GroupMemberRowAction,
  ItemRowAction,
  PassengerRowAction,
} from './types';

declare global {
  interface CONFIG {
    TIDY5E: {
      components: TidyComponentRegistry;
      partitions: TidyPartitionRegistry;
      rowActions: TidyRowActionRegistry;
    };
  }
}

type TidyComponentRegistry = {
  rowActions: Record<string, Component<any>>;
};

type TidyPartitionRegistry = {
  rowActions: {
    activity: string[];
    assignedCrew: string[];
    containerContents: string[];
    draftAnimal: string[];
    effect: string[];
    encounterCombatant: string[];
    encounterMember: string[];
    feature: string[];
    groupMember: string[];
    inventory: string[];
    itemAdvancement: string[];
    passenger: string[];
    spell: string[];
    unassignedCrew: string[];
  };
};

type TidyRowActionRegistry = {
  activity: Record<string, ActivityRowAction>;
  assignedCrew: Record<string, CrewRowAction>;
  containerContents: Record<string, ItemRowAction>;
  draftAnimal: Record<string, DraftAnimalRowAction>;
  effect: Record<string, EffectRowAction>;
  encounterCombatant: Record<string, EncounterCombatantMemberRowAction>;
  encounterMember: Record<string, EncounterMemberRowAction>;
  feature: Record<string, ItemRowAction>;
  groupMember: Record<string, GroupMemberRowAction>;
  inventory: Record<string, ItemRowAction>;
  itemAdvancement: Record<string, AdvancementRowAction>;
  passenger: Record<string, PassengerRowAction>;
  spell: Record<string, ItemRowAction>;
  unassignedCrew: Record<string, CrewRowAction>;
};

export type RowActionRegistryDomain = keyof CONFIG['TIDY5E']['rowActions'];

export type RowActionOf<D extends RowActionRegistryDomain> =
  CONFIG['TIDY5E']['rowActions'][D][keyof CONFIG['TIDY5E']['rowActions'][D]];
