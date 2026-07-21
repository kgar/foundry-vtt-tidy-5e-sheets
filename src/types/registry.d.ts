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
    TIDY5E: TidyConfig;
  }
}

/**
 * `CONFIG.TIDY5E`, the configuration backbone of Tidy 5e Sheets. Contains runtime data, components,
 * and any data needed to apply dynamic configuration to the module.
 *
 * Update this data from a script or macro while running a Foundry world with Tidy 5e Sheets active
 * to override its configurations.
 *
 * @category Configuration
 */
export type TidyConfig = {
  components: TidyComponentRegistry;
  partitions: TidyPartitionRegistry;
  rowActions: TidyRowActionRegistry;
};

/**
 * A collection of reusable svelte components across Tidy's configurable features.
 * Use these components when a configuration calls for a component.
 *
 * @category Configuration
 */
export type TidyComponentRegistry = {
  /** Components for the Row Actions feature. */
  rowActions: Record<string, Component<any>>;
};

/**
 * The organization schemes for Tidy's features. Each feature can have a different approach
 * to partitioning. Partition data is designed to contain "keys" from the relevant Tidy feature.
 * If the feature does not exist in the relevant Tidy feature area of config, the key will be ignored
 * during processing.
 *
 * @category Configuration
 */
export type TidyPartitionRegistry = {
  /**
   * Partitions for Tidy Row Actions. Update these partitions at runtime to control sort order
   * and whether a row action will be included.
   *
   * - Order of keys denotes the order that the row actions will appear in the table.
   * - Including or excluding a key controls whether the row action will be rendered at all.
   *   Excluded keys' row action condition callbacks are not even evaluated. They're just completely excluded.
   */
  rowActions: {
    /** Partitions for activity row actions. */
    activity: string[];
    /** Partitions for assigned crew row actions. */
    assignedCrew: string[];
    /** Partitions for container contents row actions. */
    containerContents: string[];
    /** Partitions for draft animal row actions. */
    draftAnimal: string[];
    /** Partitions for effect row actions. */
    effect: string[];
    /** Partitions for encounter combatant row actions. */
    encounterCombatant: string[];
    /** Partitions for encounter member row actions. */
    encounterMember: string[];
    /** Partitions for feature row actions. */
    feature: string[];
    /** Partitions for group member row actions. */
    groupMember: string[];
    /** Partitions for inventory (consumable, equipment, weapon, etc.) row actions. */
    inventory: string[];
    /** Partitions for item advancement row actions. */
    itemAdvancement: string[];
    /** Partitions for passenger row actions. */
    passenger: string[];
    /** Partitions for spell row actions. */
    spell: string[];
    /** Partitions for unassigned crew row actions. */
    unassignedCrew: string[];
  };
};

/**
 * A registry of row actions that can be partitioned.
 * At runtime, replace row action entries here to have them replaced wholesale
 * in all Tidy Sheets where they appear.
 *
 * @category Configuration
 */
export type TidyRowActionRegistry = {
  /** Row actions for activities. */
  activity: Record<string, ActivityRowAction>;
  /** Row actions for assigned crews. */
  assignedCrew: Record<string, CrewRowAction>;
  /** Row actions for container contents. */
  containerContents: Record<string, ItemRowAction>;
  /** Row actions for draft animals. */
  draftAnimal: Record<string, DraftAnimalRowAction>;
  /** Row actions for effects. */
  effect: Record<string, EffectRowAction>;
  /** Row actions for encounter combatants. */
  encounterCombatant: Record<string, EncounterCombatantMemberRowAction>;
  /** Row actions for encounter members. */
  encounterMember: Record<string, EncounterMemberRowAction>;
  /** Row actions for features. */
  feature: Record<string, ItemRowAction>;
  /** Row actions for group members. */
  groupMember: Record<string, GroupMemberRowAction>;
  /** Row actions for inventory (consumable, equipment, weapon, etc.)s. */
  inventory: Record<string, ItemRowAction>;
  /** Row actions for item advancements. */
  itemAdvancement: Record<string, AdvancementRowAction>;
  /** Row actions for passengers. */
  passenger: Record<string, PassengerRowAction>;
  /** Row actions for spells. */
  spell: Record<string, ItemRowAction>;
  /** Row actions for unassigned crews. */
  unassignedCrew: Record<string, CrewRowAction>;
};

export type RowActionRegistryDomain = keyof CONFIG['TIDY5E']['rowActions'];

export type RowActionOf<D extends RowActionRegistryDomain> =
  CONFIG['TIDY5E']['rowActions'][D][keyof CONFIG['TIDY5E']['rowActions'][D]];
