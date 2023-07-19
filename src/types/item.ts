import type { Actor5e } from "./actor";
import type { FoundryDocument } from "./document";
import type { Flags } from "./flags";

export type Item5e = Item & {
    img: string;
    sheet: { render: (force: boolean) => void; isEditable: boolean };
    actor?: Actor5e;
    name: string;
    type: string;
    _id: any;
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
  };
  
  type Item = BaseItem & {};
  
  type BaseItem = FoundryDocument & {};