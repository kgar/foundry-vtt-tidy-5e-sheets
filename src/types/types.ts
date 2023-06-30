export type SheetFunctions = {
  activateListeners: () => void;
  submit: () => void;
  render: (force: boolean) => void;
  onShortRest: (event: Event) => void;
  onLongRest: (event: Event) => void;
};
