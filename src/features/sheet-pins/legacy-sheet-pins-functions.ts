import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e, SheetPinContext } from 'src/types/types';
import { Inventory } from '../sections/Inventory';
import { SheetSections } from '../sections/SheetSections';

/** Compatibility layer for the original sheetPins implementation. Good while game.release.generation < 17 */
export function legacyGetAppropriateSheetPins(
  sheetDocument: Actor5e | Item5e,
  tabId: string,
  pins: SheetPinContext[] | undefined,
) {
  if (!pins) {
    return undefined;
  }

  switch (sheetDocument.type) {
    case CONSTANTS.SHEET_TYPE_CHARACTER: {
      return getCharacterLegacyPins(tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_NPC: {
      return getNpcLegacyPins(tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_VEHICLE: {
      return getVehicleLegacyPins(tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_GROUP: {
      return getGroupLegacyPins(tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_ENCOUNTER: {
      return getEncounterLegacyPins(tabId, pins);
    }
    default: {
      return [];
    }
  }
}

function getCharacterLegacyPins(tabId: string, pins: SheetPinContext[]) {
  if (tabId === CONSTANTS.TAB_ACTOR_ACTIONS) {
    return pins;
  }

  return pins.filter((pin) => {
    const item = pin.document.item ?? pin.document;
    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_ACTIONS ||
      (tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
        Inventory.isItemInventoryType(item)) ||
      (tabId === CONSTANTS.TAB_ACTOR_SPELLBOOK &&
        item.type === CONSTANTS.ITEM_TYPE_SPELL) ||
      (tabId === CONSTANTS.TAB_CHARACTER_FEATURES &&
        SheetSections.showInFeatures(item))
    );
  });
}

function getNpcLegacyPins(tabId: string, pins: SheetPinContext[]) {
  if (tabId === CONSTANTS.TAB_STATBLOCK) {
    return pins;
  }

  return pins.filter((pin) => {
    const item = pin.document.item ?? pin.document;
    if (!item) {
      return false;
    }

    return (
      (tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
        Inventory.isItemInventoryType(item)) ||
      (tabId === CONSTANTS.TAB_ACTOR_SPELLBOOK &&
        item.type === CONSTANTS.ITEM_TYPE_SPELL)
    );
  });
}

function getVehicleLegacyPins(tabId: string, pins: SheetPinContext[]) {
  if (tabId === CONSTANTS.TAB_STATBLOCK) {
    return pins;
  }

  return pins.filter((pin) => {
    const item = pin.document.item ?? pin.document;
    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
      Inventory.isItemInventoryType(item) &&
      !item.system.isMountable
    );
  });
}

function getGroupLegacyPins(tabId: string, pins: SheetPinContext[]) {
  if (tabId === CONSTANTS.TAB_MEMBERS) {
    return pins;
  }

  return pins.filter((pin) => {
    const item = pin.document.item ?? pin.document;

    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
      Inventory.isItemInventoryType(item)
    );
  });
}

function getEncounterLegacyPins(tabId: string, pins: SheetPinContext[]) {
  if (tabId === CONSTANTS.TAB_MEMBERS) {
    return pins;
  }

  return pins.filter((pin) => {
    const item = pin.document.item ?? pin.document;

    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
      Inventory.isItemInventoryType(item)
    );
  });
}
