export type DocumentTabSectionConfigItem = {
  key: string;
  label: string;
  show: boolean;
  // TODO: Consider just taking all the custom options as one prop, since we can leverage the item types
  persisted: boolean;
  custom: boolean;
};
