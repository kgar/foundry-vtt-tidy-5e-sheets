import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import type {
  ActiveEffect5e,
  Actor5e,
  ActorSheetQuadroneContext,
  CharacterSheetQuadroneContext,
  GroupSkillRollProcessConfiguration,
  NpcSheetQuadroneContext,
} from 'src/types/types';
import type { ContextMenuEntry, CrewArea5e } from './foundry.types';
import type {
  ContainerSheetQuadroneContext,
  Item5e,
  ItemSheetQuadroneContext,
} from 'src/types/item.types';
import type { Encounter5e, Group5e } from 'src/types/group.types';
import type { Activity5e } from './dnd5e.types';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';

/** Manages all Hook usage in Tidy 5e Sheets */
export class TidyHooks {
  /**
   * The active effect context menu has established its options and is about to show.
   * @param {ActiveEffect5e} effect The active effect document instance.
   * @param {ContextMenuEntry[]} menuItems The menu items for this active effect.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('dnd5e.getActiveEffectContextOptions', (effect, menuItems) => {
   *   return true;
   * });
   * ```
   */
  static dnd5eGetActiveEffectContextOptions(
    effect: ActiveEffect5e,
    menuItems: ContextMenuEntry[]
  ): boolean {
    return Hooks.call('dnd5e.getActiveEffectContextOptions', effect, menuItems);
  }

  /**
   * Something has been dropped on an item or container sheet. Return `false` to prevent default behavior.
   * @param item the target item
   * @param app the target item sheet
   * @param data the drop data
   * @returns `false` to prevent default behavior, else the result is discarded
   */
  static dnd5eDropItemSheetData(item: Item5e, app: any, data: any): boolean {
    return Hooks.call('dnd5e.dropItemSheetData', item, app, data);
  }

  /**
   * The item context menu has established its options and is about to show.
   * @param {Item5e} item The item document instance.
   * @param {ContextMenuEntry[]} menuItems The menu items for this item.
   * @returns {boolean} `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('dnd5e.getItemContextOptions', (item, menuItems) => {
   *   return true;
   * });
   * ```
   */
  static dnd5eGetItemContextOptions(
    item: Item5e,
    menuItems: ContextMenuEntry[]
  ): boolean {
    return Hooks.call('dnd5e.getItemContextOptions', item, menuItems);
  }

  /**
   * The facility occupant context menu has established its options and is about to show.
   * @param actor           The affected actor.
   * @param facility        The affected facility.
   * @param occupantUuid    The occupant UUID.
   * @param prop            The property for saving changes to the target occupant.
   * @param index           The index of the occupant.
   * @param contextOptions  The menu items for this occupant.
   * @returns               `true` to allow the menu to show, `false` to prevent the default menu from showing.
   */
  static dnd5eGetFacilityOccupantContextOptions(
    actor: Actor5e,
    facility: Item5e,
    occupantUuid: string | null,
    prop: string | null,
    index: number | null,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getFacilityOccupantContextOptions',
      actor,
      facility,
      occupantUuid,
      prop,
      index,
      contextOptions
    );
  }

  /**
   * Something was dropped on an actor sheet. To cancel the drop, return `false`.
   * @param actor     The affected actor.
   * @param app       The affected sheet.
   * @param data      The drop data.
   * @returns         `true` or nothing to allow the drop to continue, `false` to cancel the drop.
   */
  static foundryDropActorSheetData(actor: Actor5e, app: any, data: any) {
    return Hooks.call('dropActorSheetData', actor, app, data);
  }

  /**
   * An item is about to be used by an actor.
   * @param {Item5e} item The affected item document instance.
   * @param {any} config Any configuration for the item use.
   * @param {any} options Any options for the item use.
   * @returns {boolean} `true` to allow the item use, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.actorPreUseItem', (item, config, options) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsActorPreUseItem(item: Item5e, options: any): boolean {
    return Hooks.call('tidy5e-sheet.actorPreUseItem', item, options);
  }

  /**
   * The facility add button has been clicked for the specified facility type. Normally, this prompts the Compendium Browser.
   * @param event     The inciting event.
   * @param actor     The affected actor who will own the facility.
   * @param type      The type of facility that is intended to be added.
   * @returns         `true` to allow the default behavior, `false` to prevent it.
   */
  static tidy5eSheetsAddFacilityClicked(
    event: Event,
    actor: Actor5e,
    type: string
  ): boolean {
    return Hooks.call('tidy5e-sheet.addFacilityClicked', event, actor, type);
  }

  /**
   * An empty slot on a facility was clicked. Normally, this opens the Compendium Browser, scoped to actors of any type.
   * @param event The inciting click event
   * @param item The affected facility
   * @param occupantType The intended occupant type
   * @param prop The property path on the target facility to which changes would be applied
   * @returns `true` to allow the default behavior, `false` to prevent it.
   */
  static tidy5eSheetsFacilityEmptyOccupantSlotClicked(
    event: Event,
    item: Item5e,
    occupantType: string,
    prop: string
  ) {
    return Hooks.call(
      'tidy5e-sheet.facilityEmptyOccupantSlotClicked',
      event,
      item,
      occupantType,
      prop
    );
  }

  /**
   * The encounter member context menu has established its options and is about to show.
   * @param encounter         The affected group document instance.
   * @param member            The actor which is a member of the encounter.
   * @param contextOptions    The menu items for this encounter member.
   *
   * @returns {boolean}       `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.getEncounterMemberContextOptions', (encounter, member, contextOptions) => {
   *    // Your code here
   * });
   * ```
   */
  static tidy5eSheetsGetEncounterMemberContextOptions(
    encounter: Encounter5e,
    member: Actor5e,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getEncounterMemberContextOptions',
      encounter,
      member,
      contextOptions
    );
  }

  /**
   * The group member context menu has established its options and is about to show.
   * @param group             The affected group document instance.
   * @param member            The actor which is a member of the group.
   * @param contextOptions    The menu items for this group member.
   *
   * @returns {boolean}       `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.getGroupMemberContextOptions', (group, member, contextOptions) => {
   *    // Your code here
   * });
   * ```
   */
  static tidy5eSheetsGetGroupMemberContextOptions(
    group: Group5e,
    member: Actor5e,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getGroupMemberContextOptions',
      group,
      member,
      contextOptions
    );
  }

  /**
   * The vehicle member context menu has established its options and is about to show.
   * This can be for a member with a UUID or an empty slot where a member can go.
   * @param vehicle           The affected group document instance.
   * @param target            The HTML element where the context menu trigger occurred.
   * @param memberUuid        The potential actor UUID which is a crew member of the vehicle.
   * @param vehicleItemId     The potential ID for the crewable item for which this context menu was triggered.
   * @param area              Where the trigger occurred—draft, crew, or passengers.
   * @param contextOptions    The menu items for this encounter member.
   *
   * @returns {boolean}       `true` to allow the menu to show, `false` to prevent the default menu from showing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.getVehicleMemberContextOptions', (vehicle, target, memberUuid, vehicleItemId, area, contextOptions) => {
   *    // Your code here
   * });
   * ```
   */
  static tidy5eSheetsGetVehicleMemberContextOptions(
    vehicle: Actor5e,
    target: HTMLElement,
    memberUuid: string | undefined,
    vehicleItemId: string | undefined,
    area: CrewArea5e | undefined,
    contextOptions: ContextMenuEntry[]
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.getVehicleMemberContextOptions',
      vehicle,
      target,
      memberUuid,
      vehicleItemId,
      area,
      contextOptions
    );
  }

  /**
   * A list of visible activities has been prepared for showing on a sheet for gameplay. This is in contrast to showing activities for maintenance in a place like the Item Activities tab.
   * @param parent             The document (usually an item) which owns the activities.
   * @param data               A containing object with a filtered array of activities to show.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.getActivitiesForPlay', (parent, data) => {
   *    data.activities = data.activities.filter(a => a.name === "Hide me!");
   *    data.activities.push(mySecretActivity);
   * });
   * ```
   */
  static tidy5eSheetsGetActivitiesForPlay(
    parent: any,
    data: { activities: Activity5e[] }
  ) {
    Hooks.callAll('tidy5e-sheet.getActivitiesForPlay', parent, data);
  }

  /**
   * A user has hovered off an item, typically from an item table row.
   * @param {Event} event The triggering mouse event.
   * @param {any} item The item which is no longer hovered.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.itemHoverOff', (event, item) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsItemHoverOff(event: Event, item: any) {
    Hooks.callAll('tidy5e-sheet.itemHoverOff', event, item);
  }

  /**
   * A user has hovered over an item, typically on an item table row.
   * @param {Event} event The triggering mouse event.
   * @param {any} item The hovered-over item.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.itemHoverOn', (event, item) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsItemHoverOn(event: Event, item: any) {
    Hooks.callAll('tidy5e-sheet.itemHoverOn', event, item);
  }

  /**
   * Sheet item/effect sections are about to be configured. Use this hook to inject additional items, sections, etc., or to adjust context data.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet HTML element.
   * @param {CharacterSheetQuadroneContext | NpcSheetQuadroneContext | ContainerSheetQuadroneContext} data The data context from `getData()`.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preConfigureSections', (app, element, data) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsPreConfigureSections(
    app: any,
    element: HTMLElement,
    data: ContainerSheetQuadroneContext | ItemSheetQuadroneContext
  ) {
    Hooks.callAll('tidy5e-sheet.preConfigureSections', app, element, data);
  }

  /**
   * An active effect is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param {any} owner The owning document instance which will receive the created effect.
   * @param {object} createData The data used to create it.
   * @param {string} userId The user who initiated the creation.
   * @returns {boolean} `true` to allow the effect creation, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preCreateActiveEffect', (owner, createData, userId) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreCreateActiveEffect(
    owner: any,
    createData: object,
    userId: string
  ): boolean {
    return Hooks.call(
      'tidy5e-sheet.preCreateActiveEffect',
      owner,
      createData,
      userId
    );
  }

  /**
   * An item is about to be created for an owning document.
   * This was initiated specifically through Tidy 5e Sheets,
   * whether directly by the user, or indirectly through some user interaction.
   * @param {any} owner The owning document instance which will receive the created item.
   * @param {object} createData The data used to create it.
   * @param {string} userId The user who initiated the creation.
   * @returns {boolean} `true` to allow the item creation, `false` to prevent it.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preCreateItem', (owner, createData, userId) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreCreateItem(
    owner: any,
    createData: object,
    userId: string
  ): boolean {
    return Hooks.call('tidy5e-sheet.preCreateItem', owner, createData, userId);
  }

  /**
   * The sheet context has been prepared and is about to be used for rendering the sheet.
   * @param document the document (e.g., an Actor, an Item, etc.)
   * @param app the document's sheet
   * @param context the prepared context data
   */
  static tidy5eSheetsPrepareSheetContext(
    document: any,
    app: TidyExtensibleDocumentSheetMixinInstance,
    context: any
  ): void {
    Hooks.callAll('tidy5e-sheet.prepareSheetContext', document, app, context);
  }

  /**
   * A group skill prompt is about to execute.
   * @param app The sheet application instance.
   * @param options Options related to the eventual skill roll.
   * @returns `true` to allow the prompt to continue, `false` to prevent it.
   */
  static tidy5eSheetsPrePromptGroupSkillRoll(
    app: any,
    options: Partial<GroupSkillRollProcessConfiguration>
  ) {
    return Hooks.call('tidy5e-sheet.prePromptGroupSkillRoll', app, options);
  }

  /**
   * A tab is about to be selected.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {object} data The current tab ID before selecting the new tab, and the new tab ID to be selected.
   * @returns {boolean} `false` to cancel tabbing.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.preSelectTab', (app, element, data) => {
   *   return true;
   * });
   * ```
   */
  static tidy5eSheetsPreSelectTab(
    app: any,
    element: HTMLElement,
    data: { currentTab: any; newTab: string }
  ): boolean {
    return Hooks.call('tidy5e-sheet.preSelectTab', app, element, data);
  }

  /**
   * Tidy 5e Sheets is ready to be used and customized.
   * @param {Tidy5eSheetsApi} api The Tidy 5e Sheets API, used for customizing and registering content with Tidy 5e Sheets.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.ready', (api) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsReady(api: Tidy5eSheetsApi): void {
    Hooks.callAll('tidy5e-sheet.ready', api);
  }

  /**
   * A tab has been selected on the sheet.
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {string} newTabId The selected tab ID.
   *
   * @example
   * ```js
   * Hooks.on('tidy5e-sheet.selectTab', (app, element, newTabId) => {
   *   // Your code here
   * });
   * ```
   */
  static tidy5eSheetsSelectTab(
    app: any,
    element: HTMLElement,
    newTabId: string
  ) {
    Hooks.callAll('tidy5e-sheet.selectTab', app, element, newTabId);
  }

  /**
   *
   * @param {any} app The sheet application instance.
   * @param {HTMLElement} element The sheet's HTML element.
   * @param {object} config an object that holds the `unlocked` property. Change `unlocked` to `true` for Edit Mode and `false` for Play Mode.
   *
   * @example from Mahakala's Sheet Lock
   * ```js
   *   Hooks.on('tidy5e-sheet.sheetModeConfiguring', (app, element, config) => {
   *    if (game.user.isGM || app.document.documentName !== 'Actor') {
   *      return;
   *    }
   *
   *    const playerUnlocked = !!foundry.utils.getProperty(
   *      app.document,
   *      playerUnlockedFlagProp
   *    );
   *
   *    config.unlocked = playerUnlocked && app.isEditable;
   *  });
   * ```
   */
  static tidy5eSheetsSheetModeConfiguring(
    app: any,
    element: HTMLElement,
    config: { unlocked: boolean }
  ) {
    return Hooks.callAll(
      'tidy5e-sheet.sheetModeConfiguring',
      app,
      element,
      config
    );
  }

  static tidy5eSheetsThemeSettingsChangedHook =
    'tidy5e-sheet.themeSettingsChanged';

  /**
   * Theme settings, whether at world or sheet scope, have changed.
   * Alternatively, themes are being previewed, and relevant subscribers need to refresh their settings.
   * @param doc when dealing with a specific sheet's theme changes, this is the affected document
   */
  static tidy5eSheetsThemeSettingsChanged(doc?: any, liveThemeOverride?: ThemeSettingsV3) {
    Hooks.callAll(this.tidy5eSheetsThemeSettingsChangedHook, doc, liveThemeOverride);
  }

  static tidy5eSheetsThemeSettingsChangedSubscribe(
    callback: (doc?: any, liveThemeOverride?: ThemeSettingsV3) => void
  ): number {
    return Hooks.on(
      this.tidy5eSheetsThemeSettingsChangedHook,
      (...params: any[]) => {
        callback(...params);
      }
    );
  }

  static tidy5eSheetsThemeSettingsChangedUnsubscribe(hookId?: number): number {
    return Hooks.off(this.tidy5eSheetsThemeSettingsChangedHook, hookId);
  }
}
