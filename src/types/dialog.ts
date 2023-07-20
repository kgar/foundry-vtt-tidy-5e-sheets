export declare class Dialog {
  constructor(data: any, options: any);

  options: DialogOptions;
  appId: number;
  _element: any;
  position: Position;
  _dragDrop: any[];
  _tabs: any[];
  _searchFilters: any[];
  _minimized: boolean;
  _state: number;
  _priorState: number;
  _scrollPositions: any;

  static confirm(config?: Partial<ConfirmDialogData>): Promise<boolean>;
}

type ConfirmDialogData = {
  title: string;
  content: string;
  yes: () => void;
  no: () => void;
  defaultYes: boolean;
};

type DialogOptions = {
  baseApplication: any;
  width: number;
  height: any;
  top: any;
  left: any;
  scale: any;
  popOut: boolean;
  minimizable: boolean;
  resizable: boolean;
  id: string;
  classes: string[];
  dragDrop: any[];
  tabs: any[];
  filters: any[];
  title: string;
  template: string;
  scrollY: any[];
  focus: boolean;
  jQuery: boolean;
};

type Position = {
  width: number;
  height: any;
  left: any;
  top: any;
  scale: any;
  zIndex: number;
};
