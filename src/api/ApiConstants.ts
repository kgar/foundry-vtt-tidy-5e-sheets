import { CONSTANTS } from 'src/constants';

const ApiConstants = {
  TAB_ID_CHARACTER_ATTRIBUTES: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
  TAB_ID_CHARACTER_INVENTORY: CONSTANTS.TAB_CHARACTER_INVENTORY,
  TAB_ID_CHARACTER_SPELLBOOK: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
  TAB_ID_CHARACTER_FEATURES: CONSTANTS.TAB_CHARACTER_FEATURES,
  TAB_ID_CHARACTER_EFFECTS: CONSTANTS.TAB_CHARACTER_EFFECTS,
  TAB_ID_CHARACTER_BIOGRAPHY: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
  TAB_ID_CHARACTER_JOURNAL: CONSTANTS.TAB_CHARACTER_JOURNAL,
  TAB_ID_NPC_ABILITIES: CONSTANTS.TAB_NPC_ABILITIES,
  TAB_ID_NPC_SPELLBOOK: CONSTANTS.TAB_NPC_SPELLBOOK,
  TAB_ID_NPC_EFFECTS: CONSTANTS.TAB_NPC_EFFECTS,
  TAB_ID_NPC_BIOGRAPHY: CONSTANTS.TAB_NPC_BIOGRAPHY,
  TAB_ID_NPC_JOURNAL: CONSTANTS.TAB_NPC_JOURNAL,
  TAB_ID_VEHICLE_ATTRIBUTES: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
  TAB_ID_VEHICLE_CARGO_AND_CREW: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
  TAB_ID_VEHICLE_EFFECTS: CONSTANTS.TAB_VEHICLE_EFFECTS,
  TAB_ID_VEHICLE_DESCRIPTION: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
  TAB_ID_ACTOR_ACTIONS: CONSTANTS.TAB_ACTOR_ACTIONS,
  /**
   * Values used in conjunction with the attribute `data-tidy-sheet-part` to identify a part of a Tidy 5e sheet.
   * 
   *
   * @example an element which is tagged with a sheet part value
   * ```html
   * <div class="resources" data-tidy-sheet-part="resources-container">...</div>
   * ```
   *
   * @example targeting a sheet part for content injection during Tidy render
   * ```js
   * // Every time Tidy renders, whether a full render or a partial
   * Hooks.on('tidy5e-sheet.renderActorSheet', (sheet, element, data) => {
   *   // get the resources container of the target actor sheet
   *   element
   *     .querySelector(`[data-tidy-sheet-part="${api.constants.SHEET_PARTS.RESOURCES_CONTAINER}"]`)
   *      // inject some HTML
   *     .insertAdjacentHTML(
   *       // put it as the first element inside the resources container; see https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#afterbegin
   *       'afterbegin',
   *       // here's my content
   *       // pro tip: `data-tidy-render-scheme="handlebars"` causes this content to re-render on every Tidy render, full or partial
   *       `<div style="display: contents;" data-tidy-render-scheme="handlebars">
   *         <h2 type="button" style="width: 100%;">Resources for ${data.actor.name}</h2>
   *       </div>`
   *     );
   * });
   * ```
   *
   * @remarks
   * Tidy 5e Sheets are tagged with `data-tidy-sheet-part` attributes
   * so that most parts of the sheet can be generally identified.
   * This module uses specific attributes rather than classes because of
   * HTML classes' multiple purposes, including use for CSS styling.
   * Using sheet part attributes allows for identifying the same general thing
   * even when using a potential alternate Tidy sheet layout.
   */
  SHEET_PARTS: CONSTANTS.SHEET_PARTS,
};

export default ApiConstants;
