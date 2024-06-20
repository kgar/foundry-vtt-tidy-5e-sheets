type SimpleTextMigrationField<T> = {
  type: 'simple';
  propPath: string;
  onClick?: (target: T) => void;
};

type ContextualTextMigrationField<T> = {
  type: 'contextual';
  getText: (document: T) => string;
};

export interface MigrationSelectionParams<T> {
  onConfirm: (selected: T[]) => void | Promise<void>;
  columns: {
    name: string;
    cellWidth: 'primary' | CSSStyleDeclaration['gridTemplateColumns'];
    field: SimpleTextMigrationField<T> | ContextualTextMigrationField<T>;
  }[];
  documents: T[];
  title?: string;
}

export type SelectableMigrationSelectionParams<T> = {
  onConfirm: (selected: T[]) => void | Promise<void>;
  columns: {
    name: string;
    cellWidth: 'primary' | CSSStyleDeclaration['gridTemplateColumns'];
    field: SimpleTextMigrationField<T> | ContextualTextMigrationField<T>;
  }[];
  selectables: {
    document: T;
    selected: boolean;
  }[];
};
