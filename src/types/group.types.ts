import type { ContainerContents, Item5e } from './item.types';
import type {
  Actor5e,
  ActorSheetContextV2,
  InventorySection,
  Tab,
  TidySectionBase,
  Utilities,
} from './types';

export type GroupSheetClassicContext = {
  config: any; // TODO: If possible, convert the full CONFIG (no modules on) to a typescript type.
  currentHP: number;
  // data: unknown;
  descriptionFullEnrichedHtml: string;
  document: Group5e;
  inventory: InventorySection[];
  isGM: boolean;
  itemContext: Record<string, GroupItemContext>;
  limited: boolean;
  maxHP: number;
  memberSections: GroupMemberSection[];
  movement: GroupMovementContext;
  // nMembers: number;
  // nVehicles: number;
  // options: App V1 Options
  owner: boolean;
  // title: string;
  items: Item5e[];
  effects: unknown[];
  source: unknown;
  summary: string;
  system: Group5eSystem;
  tabs: Tab[];
  utilities: Utilities<GroupSheetClassicContext>;
  xp: Group5eXp | undefined;
} & ActorSheetContextV2<Group5e>;

export interface GroupItemContext {
  canToggle?: false;
  containerContents?: ContainerContents;
  hasTarget?: boolean;
  hasUses?: boolean;
  isStack?: boolean;
  parent?: Item5e;
  toggleClass?: string;
  totalWeight?: number;
}

export interface GroupMovementContext {
  primary: string;
  secondary: string;
}

export interface Group5e {
  _id: string;
  _stats: any;
  effects: any[];
  flags: any;
  folder: any;
  img: string;
  items: Item5e[];
  name: string;
  ownership: any;
  prototypeToken: any;
  sort: number;
  system: Group5eSystem;
  type: string;
}

// TODO: Consider making the memberContext: GroupMemberContext which is like itemContext

export type GroupMemberContext = {
  actor: Actor5e;
};

export type GroupMemberSection = TidySectionBase & {
  members: GroupMemberContext[]; // Figure out what all is actually needed here
};

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
  actor: Actor5e;
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
  value: number | null;
  derived: number;
}

/*
// Sample member from character section
{
    "index": 0,
    "quantity": {
        "value": 1,
        "formula": ""
    },
    "actor": {},
    "id": "bTQX6oH3LKDBpHpT",
    "name": "Akra 2",
    "img": "systems/dnd5e/tokens/heroes/ClericDragonborn.webp",
    "hp": {
        "current": 9,
        "max": 9,
        "pct": "100.00",
        "color": "#7fff00"
    },
    "displayHPValues": true
},

// Sample member from NPC section
{
    "index": 2,
    "quantity": {
        "value": 1,
        "formula": ""
    },
    "actor": {},
    "id": "xXmZOkqp5NZMqTv6",
    "name": "Hobgoblin",
    "img": "systems/dnd5e/tokens/humanoid/Hobgoblin.webp",
    "hp": {
        "current": 17,
        "max": 17,
        "pct": "100.00",
        "color": "#7fff00"
    },
    "displayHPValues": true,
    "cr": "½",
    "xp": "100"
}

// Sample member from vehicle section
{
    "index": 5,
    "quantity": {
        "value": 1,
        "formula": ""
    },
    "actor": {},
    "id": "B0LbtKQAaXsnx7EB",
    "name": "A Vehicle",
    "img": "icons/svg/mystery-man.svg",
    "hp": {
        "current": 0,
        "max": 0,
        "pct": "NaN",
        "color": "#000000"
    },
    "displayHPValues": true
}
*/
