import type { Tidy5eGroupSheetClassic } from 'src/sheets/Tidy5eGroupSheet';
import type { ContainerContents, Item5e } from './item.types';
import type {
  Actor5e,
  ActorSheetContextV2,
  ActorV2,
  ContainerPanelItemContext,
  InventorySection,
  Tab,
  TidySectionBase,
  Utilities,
} from './types';
import type { DocumentFilters } from 'src/runtime/item/item.types';
import type { RegisteredContent } from 'src/runtime/types';

export type GroupSheetClassicContext = {
  config: any; // TODO: If possible, convert the full CONFIG (no modules on) to a typescript type.
  currentHP: number;
  // data: unknown;
  canObserveAll: boolean;
  containerPanelItems: ContainerPanelItemContext[];
  customContent: RegisteredContent<GroupSheetClassicContext>[];
  descriptionFullEnrichedHtml: string;
  disableExperience: boolean;
  document: Group5e;
  filterData: DocumentFilters;
  filterPins: Record<string, Set<string>>;
  groupLanguages: GroupLanguage[];
  groupSkills: GroupSkill[];
  inventory: InventorySection[];
  isGM: boolean;
  itemContext: Record<string, GroupItemContext>;
  limited: boolean;
  maxHP: number;
  memberContext: Record<string, GroupMemberContext>;
  memberSections: GroupMemberSection[];
  movement: GroupMovementContext;
  // nMembers: number;
  // nVehicles: number;
  // options: App V1 Options
  owner: boolean;
  // title: string;
  items: Item5e[];
  effects: unknown[];
  showContainerPanel: boolean;
  showGroupMemberTabInfoPanel: boolean;
  source: unknown;
  summary: string;
  system: Group5eSystem;
  tabs: Tab[];
  useClassicControls: boolean;
  utilities: Utilities<GroupSheetClassicContext>;
  xp: Group5eXp | undefined;
} & ActorSheetContextV2<Group5e>;

export interface GroupItemContext {
  canToggle?: false;
  containerContents?: ContainerContents;
  hasUses?: boolean;
  isStack?: boolean;
  totalWeight?: number;
}

export interface GroupMemberContext {
  index: number;
  quantity: Group5eMemberQuantity;
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
  mod: string;
  passive: number;
};

export interface GroupMovementContext {
  primary: string;
  secondary: string;
}

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
  sheet: Tidy5eGroupSheetClassic;
  shortRest(
    options: Record<string, any> /* RestConfiguration */
  ): Promise<unknown /*ResultResult*/>;
  sort: number;
  system: Group5eSystem;
  type: string;
}

export type GroupMemberSection = TidySectionBase & {
  members: Actor5e[]; // Figure out what all is actually needed here
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
  rollQuantities(): Promise<Actor5e>;
  type: Group5eType;
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

export interface GroupLanguage {
  label: string;
  members: Actor5e[];
}

export interface GroupSkill {
  label: string;
  mod: number;
  key: string;
  members: Actor5e[];
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
