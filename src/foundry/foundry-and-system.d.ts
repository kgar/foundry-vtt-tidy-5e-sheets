/*
 * FOUNDRY/SYSTEM INTEGRATION
 *
 * These are meant to be core Foundry and dnd5e system globals.
 * They are intended to be completely dynamic (i.e., typed as `any`),
 * representing breaking off from Tidy 5e Sheets to the untyped core and system
 * globals.
 */

declare global {
  var $: any;
  var canvas: any;
  var ActiveEffect: any;
  var Actor: any;
  var Actors: any;
  var Application: any;
  var AudioHelper: any;
  var ChatMessage: any;
  var CONFIG: any;
  var CONST: any;
  var ContextMenu: any;
  var DefaultSheetsConfig: any;
  var debounce: any;
  var Dialog: any;
  var dnd5e: any;
  var DocumentSheet: any;
  var DocumentSheetConfig: any;
  var expandObject: any;
  var FilePicker: any;
  var FormApplication: any;
  var foundry: any;
  var fromUuid: any;
  var fromUuidSync: any;
  var game: any;
  var getProperty: any;
  var HandlebarsHelpers: any;
  var Hooks: any;
  var ImagePopout: any;
  var isEmpty: any;
  var Item: any;
  var Items: any;
  var mergeObject: any;
  var ModuleManagement: any;
  var NumericTerm: any;
  var renderTemplate: any;
  var Roll: any;
  var RollTerm: any;
  var TextEditor: any;
  var ui: any;

  interface ArrayConstructor {
    fromRange: (n: number, min?: number) => number[];
  }

  interface Array {
    findSplice: <T>(find: (item: T) => boolean, replace?: T) => any;
  }

  interface Math {
    clamped: (num: number, min: number, max: number) => number;
  }

  interface NumberConstructor {
    isNumeric: (n: any) => boolean;
  }

  interface Number {
    toNearest: <T extends keyof Math>(
      interval: number,
      method: T = 'round'
    ) => number;
  }
}

export type Dnd5eActorCondition = {
  name: string;
  id: string;
  icon: string;
  disabled: boolean;
  reference?: string;
};

export {};
