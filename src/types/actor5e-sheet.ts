import type { Actor5e } from './actor';

export declare class ActorSheet5eCharacter {
  constructor(...args: any[]);
  appId: number;
  _element: any;
  position: Position;
  actor: Actor5e;
  static get defaultOptions(): Record<string, unknown>;
  options: Options;
  _dragDrop: DragDrop[];

  activateListeners(html: { get: (index: number) => HTMLElement }): void;
  submit(): void;
  close(options: unknown): Promise<void>;
  setPosition(
    position: Position
  ): void | {
    left: number;
    top: number;
    width: number;
    height: number;
    scale: number;
  };
}

type Options = {
  baseApplication: string;
  width: number;
  height: number;
  top: any;
  left: any;
  scale: any;
  popOut: boolean;
  minimizable: boolean;
  resizable: boolean;
  id: string;
  classes: string[];
  dragDrop: DragDrop[];
  tabs: Tab[];
  filters: any[];
  title: string;
  template: string;
  scrollY: string[];
  closeOnSubmit: boolean;
  editable: boolean;
  sheetConfig: boolean;
  submitOnChange: boolean;
  submitOnClose: boolean;
  viewPermission: number;
  secrets: Secret[];
  token: any;
};

type DragDrop = {
  dragSelector: string;
  dropSelector: any;
  permissions: Permissions;
  callbacks: Callbacks;
};

type Permissions = {};

type Callbacks = {};

type Tab = {
  navSelector: string;
  contentSelector: string;
  initial: string;
};

type Secret = {
  parentSelector: string;
};

type Position = {
  width: number;
  height: number;
  left: any;
  top: any;
  scale: any;
  zIndex: number;
};
