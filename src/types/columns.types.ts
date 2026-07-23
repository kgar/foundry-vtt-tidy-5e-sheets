import type { Component, ComponentProps } from 'svelte';
import type { ClassValue } from 'svelte/elements';
import type { TidySectionBase } from './types';

type ColumnHeaderV2<
  TSheetDocument,
  TSheetContext,
  TComponent extends Component<any> = Component<any>,
> = {
  component: TComponent;
  props: (args: {
    document: TSheetDocument;
    context: TSheetContext;
  }) => ComponentProps<TComponent>;
};

type ColumnCellV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
  TComponent extends Component<any> = Component<any>,
> = {
  component: TComponent;
  props: (args: {
    sheetDocument: TSheetDocument;
    sheetContext: TSheetContext;
    rowDocument: TRowDocument;
    rowContext: TRowContext;
  }) => ComponentProps<TComponent>;
};

// The column you store in the registry
export type ColumnSpecificationV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
> = {
  header: ColumnHeaderV2<TSheetDocument, TSheetContext>;
  headerClasses?: ClassValue;
  cell: ColumnCellV2<TSheetDocument, TSheetContext, TRowDocument, TRowContext>;
  cellClasses?: ClassValue;
  widthRems: number;
  condition?: (
    data: ColumnSpecificationConditionArgs<TSheetDocument>,
  ) => boolean;
};

export type ColumnPartitions = {
  // Document Name may not be necessary since Tidy doesn't have document type name collisions between Actor and Item.
  // But it'd be future-proof for further Tidy expansion 💀
  [documentName: string]: {
    [documentType: string]: {
      [tabId: string]: {
        [sectionKey: string]: {
          // Question: how do I correlate a column key to a domain?
          // Answer: You would need to have a full partition spec for each domain.
          // Question: do I implement column domains?
          // Answer: <researching> 🥼
          [columnKey: string]: ColumnSpecificationPartitionData;
        };
      };
    };
  };
};

export type ColumnSpecificationPartitionData = {
  priority: number;
  order: number;
};

export type ConfiguredColumnSpecificationV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext,
> = ColumnSpecificationV2<
  TSheetDocument,
  TSheetContext,
  TRowDocument,
  TRowContext
> & {
  priority: number;
  order: number;
};

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
