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
  var AdvancementManager: any;
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
  var FilePicker: any;
  var Folder: any;
  var FormApplication: any;
  var foundry: any;
  var fromUuid: any;
  var fromUuidSync: any;
  var game: any;
  var getDocumentClass: (className: string) => any;
  var HandlebarsHelpers: any;
  var Hooks: any;
  var HTMLSecret: any;
  var ImagePopout: any;
  var Item: any;
  var Item5e: any;
  var Items: any;
  var KeyboardManager: any;
  var ModuleManagement: any;
  var NumericTerm: any;
  var renderTemplate: any;
  var Roll: any;
  var RollTerm: any;
  var SortingHelpers: any;
  var TextEditor: any;
  var ui: any;

  interface ArrayConstructor {
    fromRange: (n: number, min?: number) => number[];
  }

  interface Array {
    findSplice: <T>(find: (item: T) => boolean, replace?: T) => any;
  }

  interface Math {
    clamp: (num: number, min: number, max: number) => number;
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

  interface DragDropConfiguration {
    dragSelector?: string;
    dropSelector?: string;
    permissions?: Record<string, Function>;
    callbacks?: Record<string, Function>;
  }

  interface DragDrop {
    dragSelector: string;
    dropSelector: string;
    permissions: {
      dragstart?: (selector: string) => boolean;
      drop?: (selector: string) => boolean;
    };
    callbacks: {
      dragstart?: (event: DragEvent) => void;
      dragover?: (event: DragEvent) => void;
      drop?: (event: DragEvent) => void;
    };

    bind(html: HTMLElement): this;
    callback(event: DragEvent, action: string): void;
    can(action: string, selector: string): boolean;
  }

  var DragDrop: typeof DragDrop;

  declare const DragDrop: {
    new (config: DragDropConfiguration): DragDrop;
    createDragImage(
      img: HTMLImageElement,
      width: number,
      height: number
    ): HTMLElement;
  };
}

export type Dnd5eActorCondition = {
  name: string;
  id: string;
  icon: string;
  disabled: boolean;
  reference?: string;
};

export {};
