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
// TOOD: Use a sheets barrel
import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eEncounterSheetClassic } from 'src/sheets/classic/Tidy5eEncounterSheetClassic.svelte';
import type { Tidy5eEncounterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import type { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type { Tidy5eVehicleSheetQuadrone } from 'src/sheets/quadrone/Tidy5eVehicleSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';

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

export type RowActionRegistryDomain = keyof CONFIG['TIDY5E']['rowActions'];

export type RowActionOf<D extends RowActionRegistryDomain> =
  CONFIG['TIDY5E']['rowActions'][D][keyof CONFIG['TIDY5E']['rowActions'][D]];
