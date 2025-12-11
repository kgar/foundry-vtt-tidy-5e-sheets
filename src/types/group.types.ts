import type { Tidy5eEncounterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import type { ContainerContents, Item5e } from './item.types';
import type {
  ActivityItemContext,
  Actor5e,
  ActorV2,
  ItemSaveContext,
  TidySectionBase,
} from './types';
import type { CONSTANTS } from 'src/constants';
import type { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';

export type Encounter5e = {
  _id: string;
  _stats: any;
  effects: any[];
  flags: any;
  folder: any;
  img: string;
  items: Item5e[];
  longRest(
    options: Record<string, any> /* RestConfiguration */
  ): Promise<unknown /*ResultResult*/>;
  name: string;
  ownership: any;
  prototypeToken: any;
  sheet: Tidy5eEncounterSheetQuadrone;
  shortRest(
    options: Record<string, any> /* RestConfiguration */
  ): Promise<unknown /*ResultResult*/>;
  sort: number;
  system: Encounter5eSystem;
  type: typeof CONSTANTS.SHEET_TYPE_ENCOUNTER;
};

export interface Group5e extends ActorV2 {
  _id: string;
  _stats: any;
  effects: any[];
  flags: any;
  folder: any;
  img: string;
  items: Item5e[];
  longRest(
    options: Record<string, any> /* RestConfiguration */
  ): Promise<unknown /*ResultResult*/>;
  name: string;
  ownership: any;
  prototypeToken: any;
  sheet: Tidy5eGroupSheetQuadrone;
  shortRest(
    options: Record<string, any> /* RestConfiguration */
  ): Promise<unknown /*ResultResult*/>;
  sort: number;
  system: Group5eSystem;
  type: typeof CONSTANTS.SHEET_TYPE_GROUP;
}

export interface GroupItemContext {
  activities?: ActivityItemContext[];
  canToggle?: false;
  containerContents?: ContainerContents;
  hasUses?: boolean;
  isStack?: boolean;
  save?: ItemSaveContext;
  toHit?: number | null;
  totalWeight?: number;
}

export interface GroupMemberContext {
  index: number;
  canObserve: boolean;
  senses: string[];
  conditionImmunities: string[];
  perception?: GroupMemberSkillInfo;
  topSkills: GroupMemberSkillInfo[];
}

export interface EncounterMemberContext {
  index: number;
  quantity: Encounter5eMemberQuantity;
  canObserve: boolean;
  senses: string[];
  conditionImmunities: string[];
  perception?: GroupMemberSkillInfo;
  topSkills: GroupMemberSkillInfo[];
}

export type GroupMemberSkillInfo = {
  key: string;
  label: string;
  total: number;
  formattedTotal: string;
  passive: number;
};

export interface GroupMovementContext {
  primary: string;
  secondary: string;
}

export type GroupMemberSection = TidySectionBase & {
  members: Actor5e[];
  showCrColumn: boolean;
};

export interface Group5eSystem {
  attributes: Group5eAttributes;
  currency: Group5eCurrency;
  description: Group5eDescription;
  details: Group5eDetails;
  members: Group5eMember[];
  placeMembers(): Promise<void>;
  removeMember(id: string): Promise<Actor5e>;
}

export interface Encounter5eSystem {
  attributes: Group5eAttributes;
  currency: Group5eCurrency;
  description: Group5eDescription;
  details: Group5eDetails;
  members: Encounter5eMember[];
  placeMembers(): Promise<void>;
  removeMember(id: string): Promise<Actor5e>;
  rollQuantities(): Promise<Actor5e>;
}

export interface Group5eCurrency {
  pp: number;
  gp: number;
  ep: number;
  sp: number;
  cp: number;
}

export interface Group5eType {
  value: 'party' | 'encounter' | '';
}

export interface Group5eDescription {
  full: string;
  summary: string;
}

export interface Group5eMember {
  actor: Actor5e;
}

export interface Encounter5eMember {
  uuid: string;
  quantity: Encounter5eMemberQuantity;
}

export interface Encounter5eMemberQuantity {
  value: number;
  formula: string;
}

export interface Group5eAttributes {
  movement: Group5eMovement;
}

export interface Group5eMovement {
  land: number;
  water: number;
  air: number;
}

export interface Group5eDetails {
  xp: Group5eXp;
}

export interface Group5eXp {
  value: number | null;
  derived: number;
}

export interface GroupLanguage {
  label: string;
  members: Actor5e[];
}

export interface GroupSkill {
  label: string;
  total: number;
  key: string;
  members: Actor5e[];
}
