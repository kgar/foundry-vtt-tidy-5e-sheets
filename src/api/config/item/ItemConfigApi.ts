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

  // TODO: Document!
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

  // TODO: Document!
  registerToggle(toggle: ItemToggleConfig) {
    // TODO: Add the data to CONFIG.TIDY5E.item.toggles

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
