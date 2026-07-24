import type { Component } from 'svelte';
import type {
  ActivityRowAction,
  ItemAdvancementRowAction,
  VehicleCrewRowAction,
  VehicleDraftAnimalRowAction,
  EffectRowAction,
  EncounterCombatantMemberRowAction,
  EncounterMemberRowAction,
  GroupMemberRowAction,
  ItemRowAction,
  VehiclePassengerRowAction,
} from './row-actions.types';
// TODO: Use a sheets barrel
import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eEncounterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import type { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type { Tidy5eVehicleSheetQuadrone } from 'src/sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type {
  ActivityColumnSpec,
  ColumnPartitions,
  ColumnSpecificationV2,
  EffectColumnSpec,
  EncounterCombatantColumnSpec,
  EncounterMemberColumnSpec,
  GroupMemberColumnSpec,
  ItemAdvancementColumnSpec,
  ItemColumnSpec,
  VehicleCrewColumnSpec,
  VehicleDraftAnimalColumnSpec,
  VehiclePassengerColumnSpec,
} from './columns.types';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { ActivityItemContext, Actor5e } from './types';
import type {
  Advancement5e,
  AdvancementItemContext,
  Item5e,
} from './item.types';

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
  applications: {
    actor: {
      Tidy5eCharacterSheetQuadrone: typeof Tidy5eCharacterSheetQuadrone;
      Tidy5eNpcSheetQuadrone: typeof Tidy5eNpcSheetQuadrone;
      Tidy5eVehicleSheetQuadrone: typeof Tidy5eVehicleSheetQuadrone;
      Tidy5eGroupSheetQuadrone: typeof Tidy5eGroupSheetQuadrone;
      Tidy5eEncounterSheetQuadrone: typeof Tidy5eEncounterSheetQuadrone;
    };
    item: {
      Tidy5eItemSheetQuadrone: typeof Tidy5eItemSheetQuadrone;
      Tidy5eContainerSheetQuadrone: typeof Tidy5eContainerSheetQuadrone;
    };
    // anything else?
  };
  components: TidyComponentRegistry;
  features: TidyFeatureRegistry;
  partitions: TidyPartitionRegistry;
};

/**
 * A collection of reusable svelte components across Tidy's configurable features.
 * Use these components when a configuration calls for a component.
 *
 * @category Configuration
 */
export type TidyComponentRegistry = {
  columns: Record<string, Component<any>>;
  /** Components for the Row Actions feature. */
  rowActions: Record<string, Component<any>>;
};

/**
 * A collection of features that can be configured and extended.
 */
export type TidyFeatureRegistry = {
  /** Configure columns for Tidy's tables. */
  columns: TidyColumnRegistry;
  /** Configure row actions for Tidy's tables. */
  rowActions: TidyRowActionRegistry;
  // to do: tabs
  // to do: filters
  // to do: sort
  // to do: headerControls
  // to do: customContent
  // to do: customActorTraits
  // to do: inspiration
  // to do: tabDocumentTypes
  // to do: etc.
};

export type TidyColumnRegistry = {
  /** Columns for activities. */
  activity: Record<string, ActivityColumnSpec>;
  /** Columns for container contents. */
  containerContents: Record<string, ItemColumnSpec>;
  /** Columns for effects. */
  effect: Record<string, EffectColumnSpec>;
  /** Columns for encounter combatants. */
  encounterCombatant: Record<string, EncounterCombatantColumnSpec>;
  /** Columns for encounter members. */
  encounterMember: Record<string, EncounterMemberColumnSpec>;
  /** Columns for features. */
  feature: Record<string, ItemColumnSpec>;
  /** Columns for group members. */
  groupMember: Record<string, GroupMemberColumnSpec>;
  /** Columns for inventory (consumable, equipment, weapon, etc.)s. */
  inventory: Record<string, ItemColumnSpec>;
  /** Columns for item advancements. */
  itemAdvancement: Record<string, ItemAdvancementColumnSpec>;
  /** Columns for spells. */
  spell: Record<string, ItemColumnSpec>;
  /** Columns for a vehicle's assigned crews. */
  vehicleAssignedCrew: Record<string, VehicleCrewColumnSpec>;
  /** Columns for a vehicle's draft animals. */
  vehicleDraftAnimal: Record<string, VehicleDraftAnimalColumnSpec>;
  /** Columns for a vehicle's passengers. */
  vehiclePassenger: Record<string, VehiclePassengerColumnSpec>;
  /** Columns for a vehicle's unassigned crews. */
  vehicleUnassignedCrew: Record<string, VehicleCrewColumnSpec>;
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
   * Partitions for Tidy Columns. Update these partitions at runtime to control sort order,
   * visibility priority, and inclusion/exclusion at the full hierarchy of Foundry granularity:
   * Document Name, Document Type, Tab ID, and Section Key.
   *
   * For each level, if no suitable partition is found, Tidy sometimes uses a default fallback
   * partition, keyed as `tidy5e-sheet-default`
   */
  columns: {
    activity: ColumnPartitions;
    itemAdvancement: ColumnPartitions;
    // todo - the rest of the domains
  };

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
    /** Partitions for container contents row actions. */
    containerContents: string[];
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
    /** Partitions for spell row actions. */
    spell: string[];
    /** Partitions for a vehicle's assigned crew row actions. */
    vehicleAssignedCrew: string[];
    /** Partitions for a vehicle's draft animal row actions. */
    vehicleDraftAnimal: string[];
    /** Partitions for a vehicle's passenger row actions. */
    vehiclePassenger: string[];
    /** Partitions for a vehicle's unassigned crew row actions. */
    vehicleUnassignedCrew: string[];
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
  /** Row actions for container contents. */
  containerContents: Record<string, ItemRowAction>;
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
  itemAdvancement: Record<string, ItemAdvancementRowAction>;
  /** Row actions for spells. */
  spell: Record<string, ItemRowAction>;
  /** Row actions for a vehicle's assigned crews. */
  vehicleAssignedCrew: Record<string, VehicleCrewRowAction>;
  /** Row actions for a vehicle's draft animals. */
  vehicleDraftAnimal: Record<string, VehicleDraftAnimalRowAction>;
  /** Row actions for a vehicle's passengers. */
  vehiclePassenger: Record<string, VehiclePassengerRowAction>;
  /** Row actions for a vehicle's unassigned crews. */
  vehicleUnassignedCrew: Record<string, VehicleCrewRowAction>;
};

export type RowActionRegistryDomain =
  keyof CONFIG['TIDY5E']['features']['rowActions'];

export type RowActionOf<D extends RowActionRegistryDomain> =
  CONFIG['TIDY5E']['features']['rowActions'][D][keyof CONFIG['TIDY5E']['features']['rowActions'][D]];

export type ColumnRegistryDomain =
  keyof CONFIG['TIDY5E']['features']['columns'];

export type ColumnOf<D extends ColumnRegistryDomain> =
  CONFIG['TIDY5E']['features']['columns'][D][keyof CONFIG['TIDY5E']['features']['columns'][D]];
