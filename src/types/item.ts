import type { Actor5e } from './actor';
import type { ChatMessage } from './chat-message';
import type { FoundryDocument } from './document';
import type { Flags } from './flags';
import type { Roll } from './types';

export type Item5e = Item & {
  img: string;
  sheet: { render: (force: boolean) => void; isEditable: boolean };
  actor?: Actor5e;
  name: string;
  type: string;
  _id: any;
  labels: Record<string, string>;
  isStack?: boolean;
  system: {
    classIdentifier?: string;
    identifier: string;
    levels?: number;
    attunement?: number;
    description: {
      value: string;
      chat: string;
      unidentified: string;
    };
    source: string;
    quantity: number;
    weight: number;
    price: {
      value: number;
      denomination: string;
    };
    rarity: string;
    identified: boolean;
    equipped: boolean;
    activation?: {
      type: string;
      cost: any;
      condition: string;
    };
    duration?: {
      value: string;
      units: string;
    };
    cover?: any;
    crewed?: boolean;
    target?: {
      value: any;
      width: any;
      units: string;
      type: string;
    };
    range?: Range;
    uses?: {
      value: any;
      max: string;
      per: any;
      recovery: string;
      autoDestroy: boolean;
    };
    consume?: {
      type: string;
      target: any;
      amount: any;
    };
    ability?: any;
    actionType?: any;
    attackBonus?: string;
    chatFlavor?: string;
    critical?: {
      threshold: any;
      damage: string;
    };
    damage?: {
      parts: any[];
      versatile: string;
    };
    formula?: string;
    save?: {
      ability: string;
      dc: any;
      scaling: string;
    };
    consumableType?: string;
    properties?: Item5eProperties;
    recharge?: Item5eRecharge;
  };
  effects: any[];
  folder: any;
  sort: number;
  ownership: {
    default: number;
  };
  flags: Flags;
  _stats: {
    systemId: any;
    systemVersion: any;
    coreVersion: any;
    createdTime: any;
    modifiedTime: any;
    lastModifiedBy: any;
  };

  use(
    config: Partial<ItemUseConfiguration>,
    options?: Partial<ItemUseOptions>
  ): Promise<ChatMessage>;

  rollRecharge(): Promise<Roll>;
};

type Item5eRecharge = {
  value: number | null;
  charged: boolean;
};

export interface Item5eProperties {
  ada: boolean;
  amm: boolean;
  fin: boolean;
  fir: boolean;
  foc: boolean;
  hvy: boolean;
  lgt: boolean;
  lod: boolean;
  mgc: boolean;
  rch: boolean;
  rel: boolean;
  ret: boolean;
  sil: boolean;
  spc: boolean;
  thr: boolean;
  two: boolean;
  ver: boolean;
}

type Item = BaseItem & {};

type BaseItem = FoundryDocument & {
  id: string;
};

interface ItemUseConfiguration {
  createMeasuredTemplate: boolean;
  consumeQuantity: boolean;
  consumeRecharge: boolean;
  consumeResource: boolean;
  consumeSpellLevel: number | string | null;
  consumeSpellSlot: boolean;
  consumeUsage: boolean;
  needsConfiguration: boolean;
}

interface ItemUseOptions {
  configureDialog: boolean;
  rollMode: string;
  createMessage: boolean;
  flags: object;
  event: Event;
}
