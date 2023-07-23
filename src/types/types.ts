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

export type ActorSheetContext = {
  actor: Actor5e;
  resources: Resource[];
  skills: ActorContextSkills;
  tools: ActorContextTools;
} & Record<string, any>;

export interface Resource {
  value: number;
  max: number;
  sr: boolean;
  lr: boolean;
  label: string;
  name: string;
  placeholder: string;
}

export interface ActorContextSkills {
  acr: ActorContextSkill;
  ani: ActorContextSkill;
  arc: ActorContextSkill;
  ath: ActorContextSkill;
  dec: ActorContextSkill;
  his: ActorContextSkill;
  ins: ActorContextSkill;
  itm: ActorContextSkill;
  inv: ActorContextSkill;
  med: ActorContextSkill;
  nat: ActorContextSkill;
  prc: ActorContextSkill;
  prf: ActorContextSkill;
  per: ActorContextSkill;
  rel: ActorContextSkill;
  slt: ActorContextSkill;
  ste: ActorContextSkill;
  sur: ActorContextSkill;
}

export type ActorContextTools = Actor5e;

export interface ActorContextSkill {
  value: number;
  ability: string;
  bonuses: ActorContextSkillBonuses;
  bonus: number;
  mod: number;
  prof: ActorContextSkillProficiency;
  proficient: number;
  total: number;
  passive: number;
  abbreviation: string;
  icon: string;
  hover: string;
  label: string;
  baseValue: number;
}

export interface ActorContextSkillBonuses {
  check: string;
  passive: string;
}

export interface ActorContextSkillProficiency {
  _baseProficiency: number;
  multiplier: number;
  rounding: string;
}

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

export type D20Roll = Roll & {
  // TODO: Populate if needed
};

export type Roll = {
  // TODO: Populate if needed
};