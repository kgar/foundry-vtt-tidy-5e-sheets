import type { Component, ComponentProps } from 'svelte';
import type { ClassValue } from 'svelte/elements';
import type { TidySectionBase } from './types';

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
  header: ColumnHeaderV2<TSheetDocument, TSheetContext, TColumnHeaderContent>;
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
  priority: number;
  order: number;
};

export type ConfiguredColumnSpecificationV2<
  TSheetDocument extends object = any,
  TSheetContext extends object = any,
  TRowDocument extends object = any,
  TRowContext extends object = any,
> = ColumnSpecificationV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext
> &
  ColumnSpecificationPartitionData & {
    key: string;
  };

export type SectionColumnSpecificationsV2 = {
  sorted: (keyof SectionColumnSpecificationsV2['map'])[];
  prioritized: (keyof SectionColumnSpecificationsV2['map'])[];
  map: Record<string, ConfiguredColumnSpecificationV2>;
};

// V1

export type ColumnSpecification = {
  headerContent?:
    | {
        type: 'component';
        component: Component<ColumnHeaderProps>;
      }
    | {
        type: 'callback';
        callback: (sheetDocument: any, sheetContext: any) => string;
      }
    | {
        type: 'html';
        html: string;
      };
  cellContent:
    | {
        type: 'component';
        component: Component<ColumnCellProps>;
      }
    | {
        type: 'callback';
        callback: (rowDocument: any, rowContext: any) => string;
      };
  widthRems: number; // default: 5 (rem)
  priority: number;
  order: number;
  headerClasses?: ClassValue;
  cellClasses?: ClassValue;
  condition?: (data: ColumnSpecificationConditionArgs<any>) => boolean;
};

export type ConfiguredSectionColumnSpecification =
  ConfiguredColumnSpecification;

export type SectionColumnSpecifications = {
  sorted: (keyof SectionColumnContext['map'])[];
  prioritized: (keyof SectionColumnContext['map'])[];
  map: Record<string, ConfiguredColumnSpecification>;
};

export type SectionColumnContext = {
  sorted: (keyof SectionColumnContext['map'])[];
  prioritized: (keyof SectionColumnContext['map'])[];
  map: Record<string, ConfiguredSectionColumnSpecification>;
};

/** Column specification whose optionally calculable width has been calculated and which has a key for uniquely identifying it. */
export type ConfiguredColumnSpecification = ColumnSpecification & {
  key: string;
  widthRems: number;
};

export type ColumnHeaderProps<
  TDocument = any,
  TContext = any,
  TSection = TidySectionBase,
> = {
  sheetDocument: TDocument;
  sheetContext: TContext;
  section: TSection;
};

export type ColumnCellProps<
  TDocument = any,
  TContext = any,
  TSection = TidySectionBase,
> = {
  rowDocument: TDocument;
  rowContext: TContext;
  section: TSection;
};

export type ColumnSpecificationConditionArgs<TDocument = any> = {
  sheetDocument: TDocument;
};

export type ColumnSpecSectionKeysToColumns = Record<
  string | symbol,
  Record<string, ColumnSpecification>
>;

export type ColumnSpecTabIdsToSectionKeys = Record<
  string,
  ColumnSpecSectionKeysToColumns
>;

export type ColumnSpecDocumentTypesToTabs = Record<
  string,
  ColumnSpecTabIdsToSectionKeys
>;

export type DefaultColumnSpecTabsToColumns = Record<
  string,
  ColumnSpecification[]
>;

export type DefaultColumnSpecDocumentTypesToTabs = Record<
  string,
  DefaultColumnSpecTabsToColumns
>;

export type DefaultTableColumn = Omit<
  ColumnSpecification,
  'order' | 'priority'
>;

export type DefaultTableColumns = Record<string, DefaultTableColumn>;

export type ColumnPartitionOptions = {
  sheetDocumentType?: string;
  tabId?: string;
  sectionKey?: string;
};
