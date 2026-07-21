/* CORE TYPES */

import type { Activity5e } from 'src/foundry/dnd5e.types';
import type { Component, ComponentProps } from 'svelte';
import type { Item5e } from './item.types';
import type {
  Actor5e,
  ActiveEffect5e,
  ActiveEffectContext,
  ActivityItemContext,
  VehicleDraftAnimalContext,
  VehiclePassengerMemberContext,
  VehicleCrewMemberContext,
  GroupMemberQuadroneContext,
  EncounterMemberQuadroneContext,
  EncounterMemberCombatantQuadroneContext,
  EncounterPlaceholderQuadroneContext,
} from './types';

/**
 * The base definition of what makes row action props.
 *
 * @category Row Actions
 */
export type TableRowActionProps<TData extends object> = TData;

/**
 * Common data that is useful to include for any conditional checks.
 *
 * @category Row Actions
 */
export type CommonConditionContextData = {
  /** The current user owns this document. */
  owner: boolean;

  /** The document is in Edit mode. */
  unlocked: boolean;

  /**
   * The user has edit permissions to the document, and the document
   * is not read-only / inside a locked compendium.
   */
  editable: boolean;
};

/**
 * The basis for the row actions that appear in Tidy's tables.
 *
 * @typeParam TComponent - The svelte component used to render the action.
 * @typeParam TPropsData - The data passed to the `props` function.
 * @typeParam TConditionData - The data passed to the `condition` function.
 *
 * @category Row Actions
 */
export type TableRowAction<
  TComponent extends Component<any>,
  TPropsData extends object,
  TConditionData extends object,
> = {
  /** The Svelte component to render. */
  component: TComponent;
  /**
   * A function that maps row data → component props for this row action,
   * for a given row in the table.
   */
  props: (args: TableRowActionProps<TPropsData>) => ComponentProps<TComponent>;
  /**
   * An optional condition callback that determines whether the row action
   * should be included for a given row in the table
   */
  condition?: (args: TableRowActionProps<TConditionData>) => boolean;
};

/* ITEM */

/**
 * Props passed to item row-action components.
 *
 * @category Row Actions
 */
export type ItemRowActionPropsData = {
  /** The item represented by this row. */
  item: Item5e;

  // TODO: Eliminate `any` for ItemRowActionPropsData; will likely have to permute into types to match the domains
  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: any;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type ItemRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e | Item5e;

  /** The item represented by this row. */
  rowDocument: Item5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for inventory items, equipment, loot, etc.
 *
 * @category Row Actions
 */
export type ItemRowAction<TComponent extends Component<any> = Component<any>> =
  TableRowAction<
    TComponent,
    ItemRowActionPropsData,
    ItemRowActionConditionData
  >;

/* EFFECT */

/**
 * Props passed to effect row-action components.
 *
 * @category Row Actions
 */
export type EffectRowActionPropsData = {
  /** The active effect represented by this row. */
  effect: ActiveEffect5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: ActiveEffectContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type EffectRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e | Item5e;

  /** The active effect represented by this row. */
  rowDocument: ActiveEffect5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for active effects.
 *
 * @category Row Actions
 */
export type EffectRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  EffectRowActionPropsData,
  EffectRowActionConditionData
>;

/* ACTIVITY */

/**
 * Props passed to activity row-action components.
 *
 * @category Row Actions
 */
export type ActivityRowActionPropsData = {
  /** The activity represented by this row. */
  activity: Activity5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: ActivityItemContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type ActivityRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e | Item5e;

  /** The activity represented by this row. */
  rowDocument: Activity5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for activities.
 *
 * @category Row Actions
 */
export type ActivityRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  ActivityRowActionPropsData,
  ActivityRowActionConditionData
>;

/* VEHICLE DRAFT ANIMAL */

/**
 * Props passed to vehicle draft animal row-action components.
 *
 * @category Row Actions
 */
export type VehicleDraftAnimalRowActionPropsData = {
  /** The actor represented by this row. */
  actor: Actor5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: VehicleDraftAnimalContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type VehicleDraftAnimalRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for vehicle draft animals.
 *
 * @category Row Actions
 */
export type VehicleDraftAnimalRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  VehicleDraftAnimalRowActionPropsData,
  VehicleDraftAnimalRowActionConditionData
>;

/* VEHICLE PASSENGER */

/**
 * Props passed to vehicle passenger row-action components.
 *
 * @category Row Actions
 */
export type VehiclePassengerRowActionPropsData = {
  /** The actor represented by this row. */
  actor: Actor5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: VehiclePassengerMemberContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type VehiclePassengerRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for vehicle passengers.
 *
 * @category Row Actions
 */
export type VehiclePassengerRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  VehiclePassengerRowActionPropsData,
  VehiclePassengerRowActionConditionData
>;

/* VEHICLE CREW */

/**
 * Props passed to vehicle crew row-action components.
 *
 * @category Row Actions
 */
export type VehicleCrewRowActionPropsData = {
  /** The actor represented by this row. */
  actor: Actor5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: VehicleCrewMemberContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type VehicleCrewRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for vehicle crew.
 *
 * @category Row Actions
 */
export type VehicleCrewRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  VehicleCrewRowActionPropsData,
  VehicleCrewRowActionConditionData
>;

/* GROUP MEMBER */

/**
 * Props passed to group member row-action components.
 *
 * @category Row Actions
 */
export type GroupMemberRowActionPropsData = {
  /** The actor represented by this row. */
  actor: Actor5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: GroupMemberQuadroneContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type GroupMemberRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for group members.
 *
 * @category Row Actions
 */
export type GroupMemberRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  GroupMemberRowActionPropsData,
  GroupMemberRowActionConditionData
>;

/* ENCOUNTER MEMBER */

/**
 * Props passed to encounter member row-action components.
 *
 * @category Row Actions
 */
export type EncounterMemberRowActionPropsData = {
  /** The actor represented by this row. */
  actor: Actor5e;

  /** Optional contextual data. Primarily for internal Tidy use, so use at your own risk. */
  ctx?: EncounterMemberQuadroneContext;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type EncounterMemberRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for encounter members.
 *
 * @category Row Actions
 */
export type EncounterMemberRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  EncounterMemberRowActionPropsData,
  EncounterMemberRowActionConditionData
>;

/* ENCOUNTER COMBATANT */

/**
 * Props passed to encounter combatant member row-action components.
 * Note that the data varies when dealing with an actor or a combat placeholder.
 *
 * @category Row Actions
 */
export type EncounterCombatantMemberRowActionPropsData =
  EncounterMemberCombatantQuadroneContext | EncounterPlaceholderQuadroneContext;

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type EncounterCombatantMemberRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The actor represented by this row. */
  rowDocument?: Actor5e;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for encounter combatants.
 * Encounter combatants can be actors or placeholders.
 *
 * @category Row Actions
 */
export type EncounterCombatantMemberRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  EncounterCombatantMemberRowActionPropsData,
  EncounterCombatantMemberRowActionConditionData
>;

/* ADVANCEMENT */

/**
 * Props passed to advancement row-action components.
 *
 * @category Row Actions
 */
export type AdvancementRowActionPropsData = {
  /** The item to which this advancement belongs. */
  item: Item5e;

  /** The advancement's ID. */
  id: string;
};

/**
 * The available `args` data when evaluating the relevant row action's optional condition callback.
 * Use this data (and any external data like settings, flags, etc.) to decide
 * if your row action should be included for a given row in the table.
 *
 * @category Row Actions
 */
export type AdvancementRowActionConditionData = {
  /** The sheet-level document. */
  sheetDocument: Actor5e;

  /** The advancement represented by this row. */
  rowDocument?: any;

  /** The sheet application instance. */
  app: any;

  /** Common access-level data for convenience. */
  data: CommonConditionContextData;
};

/**
 * Row action type for item advancements.
 *
 * @category Row Actions
 */
export type AdvancementRowAction<
  TComponent extends Component<any> = Component<any>,
> = TableRowAction<
  TComponent,
  AdvancementRowActionPropsData,
  AdvancementRowActionConditionData
>;
