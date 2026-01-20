/*
 * FOUNDRY/SYSTEM INTEGRATION
 *
 * These are meant to be core Foundry and dnd5e system globals.
 * They are intended to be completely dynamic (i.e., typed as `any`),
 * representing breaking off from Tidy 5e Sheets to the untyped core and system
 * globals.
 */

import {
  AlphaField,
  AngleField,
  AnyField,
  ArrayField,
  BooleanField,
  ColorField,
  DataField,
  DocumentAuthorField,
  DocumentFlagsField,
  DocumentIdField,
  DocumentOwnershipField,
  DocumentStatsField,
  DocumentTypeField,
  DocumentUUIDField,
  EmbeddedCollectionDeltaField,
  EmbeddedCollectionField,
  EmbeddedDataField,
  EmbeddedDocumentField,
  FilePathField,
  ForeignDocumentField,
  HTMLField,
  HueField,
  IntegerSortField,
  JavaScriptField,
  JSONField,
  NumberField,
  ObjectField,
  SchemaField,
  SetField,
  StringField,
  TypeDataField,
  TypedObjectField,
  TypedSchemaField,
} from 'foundry.data.fields';

import {
  AdvancementDataField,
  AdvancementField,
  AdvantageModeField,
  FormulaField,
  IdentifierField,
  LocalDocumentField,
  MappingField,
} from 'dnd5e.dataModels.fields';

import type { CONFIG } from './config.types';

declare global {
  var $: any;
  var canvas: any;
  var ActiveEffect: any;
  var Actor: any;
  var ActorSheet: any;
  var Actors: any;
  var Application: any;
  var AudioHelper: any;
  var ChatMessage: any;
  var CONFIG: CONFIG & { Dice: any };
  var CONST: any;
  var DefaultSheetsConfig: any;
  var debounce: any;
  var dnd5e: {
    dataModels: {
      fields: {
        AdvancementDataField: typeof AdvancementDataField;
        AdvancementField: typeof AdvancementField;
        AdvantageModeField: typeof AdvantageModeField;
        FormulaField: typeof FormulaField;
        IdentifierField: typeof IdentifierField;
        LocalDocumentField: typeof LocalDocumentField;
        MappingField: typeof MappingField;
      };
      item: any;
    };
  } & Record<string, any>;
  var Folder: any;
  var foundry: {
    applications: {
      api: any;
      apps: any;
      elements: any;
      handlebars: any;
      instances: Map<string, any /* AppV2 instance */>;
      sheets: any;
      ui: any;
      ux: {
        DragDrop: {
          new (config: DragDropConfiguration): DragDrop;
          implementation: DragDrop;
        };
      } & Record<string, any>;
    };
    data: {
      fields: {
        AlphaField: typeof AlphaField;
        AngleField: typeof AngleField;
        AnyField: typeof AnyField;
        ArrayField: typeof ArrayField;
        BooleanField: typeof BooleanField;
        ColorField: typeof ColorField;
        DataField: typeof DataField;
        DocumentAuthorField: typeof DocumentAuthorField;
        DocumentFlagsField: typeof DocumentFlagsField;
        DocumentIdField: typeof DocumentIdField;
        DocumentOwnershipField: typeof DocumentOwnershipField;
        DocumentStatsField: typeof DocumentStatsField;
        DocumentTypeField: typeof DocumentTypeField;
        DocumentUUIDField: typeof DocumentUUIDField;
        EmbeddedCollectionDeltaField: typeof EmbeddedCollectionDeltaField;
        EmbeddedCollectionField: typeof EmbeddedCollectionField;
        EmbeddedDataField: typeof EmbeddedDataField;
        EmbeddedDocumentField: typeof EmbeddedDocumentField;
        FilePathField: typeof FilePathField;
        ForeignDocumentField: typeof ForeignDocumentField;
        HTMLField: typeof HTMLField;
        HueField: typeof HueField;
        IntegerSortField: typeof IntegerSortField;
        JSONField: typeof JSONField;
        JavaScriptField: typeof JavaScriptField;
        NumberField: typeof NumberField;
        ObjectField: typeof ObjectField;
        SchemaField: typeof SchemaField;
        SetField: typeof SetField;
        StringField: typeof StringField;
        TypeDataField: typeof TypeDataField;
        TypedObjectField: typeof TypedObjectField;
        TypedSchemaField: typeof TypedSchemaField;
      };
      validators: any;
    };
  } & Record<string, any>;
  var fromUuid: any;
  var fromUuidSync: any;
  var game: any;
  var getDocumentClass: (className: string) => any;
  var Hooks: any;
  var ImagePopout: any;
  var Item: any;
  var Items: any;
  var ModuleManagement: any;
  var ProseMirror: any;
  var renderTemplate: any;
  var Roll: any;
  var TokenDocument: any;
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
    isNumeric: (n: any) => n is number;
  }

  interface Number {
    toNearest: <T extends keyof Math>(
      interval: number,
      method: T = 'round'
    ) => number;
  }

  interface DragDropConfiguration {
    dragSelector?: string | null;
    dropSelector?: string | null;
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
    dropEffect: 'copy' | 'move' | 'link' | 'none';
    getPayload: (event: DragEvent) => object;
    createDragImage(
      img: HTMLImageElement,
      width: number,
      height: number
    ): HTMLElement;
  }
}

declare global {
  interface String {
    slugify({
      replacement = '-',
      strict = false,
      lowercase = true,
    } = {}): string;
    titleCase(): string;
    capitalize(): string;
  }

  interface Array<T> {
    filterJoin(sep: string): string;
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
