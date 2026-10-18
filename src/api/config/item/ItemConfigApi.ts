import type {
  EquipmentTypeGroup,
  ItemDescriptionConfig,
  ItemToggleConfig,
} from 'src/api/api.types';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';

/**
 * APIs related to the configuration of items.
 */
export class ItemConfigApi {
  /**
   * Registers a custom group of equipment types, to be rendered on the item sheet as their own section of options within the Equipment Type input.
   *
   * @param group the group to add
   *
   * @example Registering custom helmets
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.config.item.registerCustomEquipmentTypeGroup({
   *     label: 'Helmet',
   *     types: {
   *       clothhat: 'Clothings Helmet',
   *       lighthat: 'Light Helmet',
   *       mediumhat: 'Medium Helmet',
   *       heavyhat: 'Heavy Helmet',
   *     },
   *   });
   * });
   * ```
   */
  registerCustomEquipmentTypeGroup(group: EquipmentTypeGroup) {
    ItemSheetQuadroneRuntime.registerCustomEquipmentTypeGroup(group);
  }

  /**
   * Registers a custom description, to be rendered on the item sheet.
   *
   * @param description the description to add
   *
   * @example Registering a custom description
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.config.item.registerDescription({
   *     id: 'my-curse-description',
   *     label: 'Curse Details',
   *     itemTypes: ['weapon', 'equipment', 'tool', 'loot'],
   *     visible: (item) => game.user.isGM && foundry.utils.getProperty(item, 'flags.my-example.is-cursed'),
   *     field: 'flags.my-example.my-curse-description',
   *     editable: (item) => game.user.isGM,
   *   });
   * });
   * ```
   */
  registerDescription(description: ItemDescriptionConfig) {
    let { itemTypes = [], id, ...rest } = description;

    if (!itemTypes.length) {
      // TODO: Consider using a symbol for all item types
      itemTypes = Item.TYPES;
    }

    for (const type of itemTypes) {
      CONFIG.TIDY5E.item.descriptions[type] ??= {};
      CONFIG.TIDY5E.item.descriptions[type][id] = {
        ...rest,
      };
    }
  }

  /**
   * Registers a custom toggle switch to appear in the item sheet sidebar, 
   * where other toggles like "Identified," "Equipped," and "Attuned."
   * 
   * @param toggle the toggle to add
   * 
   * @example Registering a custom toggle
   * ```js
   * Hooks.once('tidy5e-sheet.ready', (api) => {
   *   api.config.item.registerToggle?.({
   *     id: 'cursed-toggle',
   *     label: 'Cursed',
   *     icon: 'fa-solid fa-book-skull',
   *     itemTypes: ['weapon', 'equipment', 'tool', 'loot'],
   *     editable: () => game.user.isGM,
   *     field: 'flags.my-example.is-cursed',
   *     visible: (item) => game.user.isGM,
   *   });
   * });
   * ```
   */
  registerToggle(toggle: ItemToggleConfig) {
    let { itemTypes = [], id, ...rest } = toggle;

    if (!itemTypes.length) {
      // TODO: Consider using a symbol for all item types
      itemTypes = Item.TYPES;
    }

    for (const type of itemTypes) {
      CONFIG.TIDY5E.item.toggles[type] ??= {};
      CONFIG.TIDY5E.item.toggles[type][id] = {
        ...rest,
      };
    }
  }
}
