type SimpleTextMigrationField<T> = {
  propPath: string;
  onClick?: (target: T) => void;
};

export interface MigrationSelectionParams<T> {
  onConfirm: (selected: T[]) => void | Promise<void>;
  columns: {
    name: string;
    cellWidth: 'primary' | CSSStyleDeclaration['gridTemplateColumns'];
    field: SimpleTextMigrationField<T>;
  }[];
  documents: T[];
  title?: string;
}

export type SelectableMigrationSelectionParams<T> = {
  onConfirm: (selected: T[]) => void | Promise<void>;
  columns: {
    name: string;
    cellWidth: 'primary' | CSSStyleDeclaration['gridTemplateColumns'];
    field: SimpleTextMigrationField<T>;
  }[];
  selectables: {
    document: T;
    selected: boolean;
  }[];
};
