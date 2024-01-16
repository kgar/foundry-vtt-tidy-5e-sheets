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
  var Actors: any;
  var Application: any;
  var AudioHelper: any;
  var ChatMessage: any;
  var CONFIG: any;
  var ContextMenu: any;
  var debounce: any;
  var Dialog: any;
  var dnd5e: any;
  var DocumentSheet: any;
  var expandObject: any;
  var FilePicker: any;
  var FormApplication: any;
  var foundry: any;
  var game: any;
  var HandlebarsHelpers: any;
  var Hooks: any;
  var KeyboardManager: any;
  var ImagePopout: any;
  var isEmpty: any;
  var Items: any;
  var mergeObject: any;
  var NumericTerm: any;
  var renderTemplate: any;
  var Roll: any;
  var RollTerm: any;
  var SettingsConfig: any;
  var TextEditor: any;
  var ui: any;
}

export {};
