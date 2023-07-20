import type { Actor5e } from './actor';

export type SheetFunctions = {
  activateListeners: () => void;
  submit: () => void;
  render: (force: boolean) => void;
  onShortRest: (event: Event) => void;
  onLongRest: (event: Event) => void;
  onEditImage: (event: Event) => void;
  onToggleAbilityProficiency: (event: Event) => void;
  onToggleFilter: (setName: string, filterName: string) => unknown;
  isFilterActive: (setName: string, filterName: string) => boolean;
};

export type ClassSummary = {
  class?: string;
  subclass?: string;
  level?: string;
};

export type CharacterSheetContext = { actor: Actor5e } & Record<string, any>;

export type RoundedPortaitStyleOptions = 'default' | 'pc' | 'npc' | 'all';

export type TidyDropdownOption = { value: any; text: string };

export type PortraitCharmRadiusClass =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'rounded';

export type ItemLayoutMode = 'grid' | 'list';

export type DropdownOption = { text: string; value: string };

export type globalThisUI = {
  notifications: ClientNotifications;
};

type ClientNotifications = {
  error(message: string, options?: Partial<NotifyOptions>): void;
  info(message: string, options?: Partial<NotifyOptions>): void;
  warn(message: string, options?: Partial<NotifyOptions>): void;
};

type NotifyOptions = {
  permanent: boolean;
  localize: boolean;
  console: boolean;
};

