import type { Component, ComponentProps } from 'svelte';
import type { ClassValue } from 'svelte/elements';
import type {
  ActiveEffect5e,
  ActiveEffectContext,
  ActivityItemContext,
  Actor5e,
  EncounterMemberCombatantQuadroneContext,
  EncounterMemberQuadroneContext,
  EncounterPlaceholderQuadroneContext,
  EncounterSheetQuadroneContext,
  GroupMemberQuadroneContext,
  GroupSheetQuadroneContext,
  TidySectionBase,
  VehicleCrewMemberContext,
  VehicleDraftAnimalContext,
  VehiclePassengerMemberContext,
  VehicleSheetQuadroneContext,
} from './types';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import type {
  Item5e,
  Advancement5e,
  AdvancementItemContext,
} from './item.types';

export type ColumnHeaderPropsData<TSheetDocument, TSheetContext> = {
  sheetDocument: TSheetDocument;
  sheetContext: TSheetContext;
};

export type ColumnHeaderV2<
  TSheetDocument,
  TSheetContext,
  TComponent extends Component<any> = Component<any>,
> = {
  component: TComponent;
  props: (
    args: ColumnHeaderPropsData<TSheetDocument, TSheetContext>,
  ) => ComponentProps<TComponent>;
  /**
   * Denotes the classes to place on the Tidy Table Header Cell
   * which encloses this content.
   */
  classes?: ClassValue;
};

export type ColumnCellPropsData<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
> = {
  sheetDocument: TSheetDocument;
  sheetContext: TSheetContext;
  rowDocument: TRowDocument;
  rowContext: TRowContext;
};

type ColumnCellV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
  TComponent extends Component<any> = Component<any>,
> = {
  component: TComponent;
  props: (
    args: ColumnCellPropsData<
      TSheetDocument,
      TSheetContext,
      TRowDocument,
      TRowContext
    >,
  ) => ComponentProps<TComponent>;
  /**
   * Denotes the classes to place on the Tidy Table Cell
   * which encloses this content.
   */
  classes?: ClassValue;
};

// The column you store in the registry
export type ColumnSpecificationV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = {
  header?: ColumnHeaderV2<TSheetDocument, TSheetContext, TColumnHeaderContent>;
  cell: ColumnCellV2<
    TSheetDocument,
    TSheetContext,
    TRowDocument,
    TRowContext,
    TColumnCellContent
  >;
  widthRems: number;
  condition?: (
    data: ColumnSpecificationConditionArgs<TSheetDocument>,
  ) => boolean;
};

export type ColumnPartitions = {
  [documentType: 'tidy5e-sheet-default' | string]: {
    [tabId: 'tidy5e-sheet-default' | string]: {
      [sectionKey: 'tidy5e-sheet-default' | string]: {
        [
          columnKey: 'tidy5e-sheet-default' | string
        ]: ColumnSpecificationPartitionData;
      };
    };
  };
};

export type ColumnSpecificationPartitionData = {
  widthRems?: number;
  condition?: (data: ColumnSpecificationConditionArgs<any>) => boolean;
  priority: number;
  order: number;
};

export type ConfiguredColumnSpecificationV2<
  TSpec extends ColumnSpecificationV2<any, any, any, any, any, any>,
> = TSpec &
  ColumnSpecificationPartitionData & {
    key: string;
  };

export type SectionColumnSpecificationsV2<
  TSpec extends ConfiguredColumnSpecificationV2<any>,
> = {
  sorted: (keyof SectionColumnSpecificationsV2<TSpec>['map'])[];
  prioritized: (keyof SectionColumnSpecificationsV2<TSpec>['map'])[];
  map: Record<string, TSpec>;
};

export type ActivityColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e | Item5e,
  any,
  Activity5e,
  ActivityItemContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type ItemAdvancementColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Item5e,
  any,
  Advancement5e,
  AdvancementItemContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type EncounterCombatantColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  EncounterSheetQuadroneContext,
  Actor5e,
  EncounterMemberCombatantQuadroneContext | EncounterPlaceholderQuadroneContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type EncounterMemberColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  EncounterSheetQuadroneContext,
  Actor5e,
  EncounterMemberQuadroneContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type GroupMemberColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  GroupSheetQuadroneContext,
  Actor5e,
  GroupMemberQuadroneContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type ItemColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e | Item5e,
  any,
  Item5e,
  any,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type EffectColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e | Item5e,
  any,
  ActiveEffect5e,
  ActiveEffectContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type VehicleCrewColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  VehicleSheetQuadroneContext,
  Actor5e,
  VehicleCrewMemberContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type VehicleDraftAnimalColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  VehicleSheetQuadroneContext,
  Actor5e,
  VehicleDraftAnimalContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type VehiclePassengerColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e,
  VehicleSheetQuadroneContext,
  Actor5e,
  VehiclePassengerMemberContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

export type ColumnSpecificationConditionArgs<TDocument = any> = {
  /** The sheet document related to this usage of the column specification. */
  sheetDocument: TDocument;

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

export type ColumnPartitionOptions = ColumnSpecificationConditionArgs & {
  /** The relevant tab for these columns. If left blank, Tidy assumes the default/fallback columns. */
  tabId?: string;

  /** The relevant section key for these columns.  If left blank, Tidy assumes the default/fallback columns. */
  sectionKey?: string;
};
