export type SheetFunctions = {
  activateListeners: () => void;
  submit: () => void;
  render: (force: boolean) => void;
  onShortRest: (event: Event) => void;
  onLongRest: (event: Event) => void;
  onEditImage: (event: Event) => void;
};

export type ClassSummary = {
  class?: string;
  subclass?: string;
  level?: string;
};

export type ItemStub = {
  type: string;
  name: string;
  system: {
    classIdentifier?: string;
    identifier: string;
    levels?: number;
  }
}