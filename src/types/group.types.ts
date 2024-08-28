import type { Item5e } from './item.types';
import type { Tab } from './types';

export type GroupSheetClassicContext = {
  tabs: Tab[];
  actor: Group5e;
};

export interface Group5e {
  name: string;
  type: string;
  _id: string;
  img: string;
  system: Group5eSystem;
  prototypeToken: any;
  items: Item5e[];
  effects: any[];
  folder: any;
  sort: number;
  ownership: any;
  flags: any;
  _stats: any;
}

export interface Group5eSystem {
  currency: Group5eCurrency;
  type: Group5eType;
  description: Group5eDescription;
  members: Group5eMember[];
  attributes: Group5eAttributes;
  details: Group5eDetails;
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
  actor: string;
  quantity: Group5eMemberQuantity;
}

export interface Group5eMemberQuantity {
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
  value: any;
}
