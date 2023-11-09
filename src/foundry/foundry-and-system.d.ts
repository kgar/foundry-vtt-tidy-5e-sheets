/*
 * FOUNDRY/SYSTEM INTEGRATION
 *
 * These are meant to be core Foundry and dnd5e system globals.
 * They are intended to be completely dynamic (i.e., typed as `any`),
 * representing breaking off from Tidy 5e Sheets to the untyped core and system
 * globals.
 */

declare global {
  var Hooks: any;
  var foundry: any;
  var game: any;
  var Actors: any;
  var Items: any;
  var CONFIG: any;
  var Roll: any;
  var dnd5e: any;
  var ui: any;
  var debounce: any;
  var ChatMessage: any;
  var AudioHelper: any;
  var TextEditor: any;
  var ContextMenu: any;
  var ImagePopout: any;
  var FilePicker: any;
  var mergeObject: any;
  var expandObject: any;
  var isEmpty: any;
  var HandlebarsHelpers: any;
}

export {};
