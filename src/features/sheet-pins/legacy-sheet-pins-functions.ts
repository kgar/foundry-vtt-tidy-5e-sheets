import { CONSTANTS } from 'src/constants';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e, SheetPinContext } from 'src/types/types';
import { Inventory } from '../sections/Inventory';
import { SheetSections } from '../sections/SheetSections';
import type { AnySheetPinFlagData } from 'src/foundry/TidyFlags.types';

/** Compatibility layer for the original sheetPins implementation. Good while game.release.generation < 17 */
export function legacyGetAppropriateSheetPins(
  sheetDocument: Actor5e | Item5e,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[] | undefined,
) {
  if (!pins) {
    return undefined;
  }

  switch (sheetDocument.type) {
    case CONSTANTS.SHEET_TYPE_CHARACTER: {
      return getCharacterLegacyPins(sheetDocument, tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_NPC: {
      return getNpcLegacyPins(sheetDocument, tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_VEHICLE: {
      return getVehicleLegacyPins(sheetDocument, tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_GROUP: {
      return getGroupLegacyPins(sheetDocument, tabId, pins);
    }
    case CONSTANTS.SHEET_TYPE_ENCOUNTER: {
      return getEncounterLegacyPins(sheetDocument, tabId, pins);
    }
    default: {
      return [];
    }
  }
}

function getCharacterLegacyPins(
  sheetDocument: any,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[],
) {
  if (tabId === CONSTANTS.TAB_ACTOR_ACTIONS) {
    return pins;
  }

  return pins.filter((pin) => {
    const document = fromUuidSync(pin.id, { relative: sheetDocument });

    const item = document?.item ?? document;

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

function getNpcLegacyPins(
  sheetDocument: any,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[],
) {
  if (tabId === CONSTANTS.TAB_STATBLOCK) {
    return pins;
  }

  return pins.filter((pin) => {
    const document = fromUuidSync(pin.id, { relative: sheetDocument });

    const item = document?.item ?? document;

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

function getVehicleLegacyPins(
  sheetDocument: any,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[],
) {
  if (tabId === CONSTANTS.TAB_STATBLOCK) {
    return pins;
  }

  return pins.filter((pin) => {
    const document = fromUuidSync(pin.id, { relative: sheetDocument });

    const item = document?.item ?? document;

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

function getGroupLegacyPins(
  sheetDocument: any,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[],
) {
  if (tabId === CONSTANTS.TAB_MEMBERS) {
    return pins;
  }

  return pins.filter((pin) => {
    const document = fromUuidSync(pin.id, { relative: sheetDocument });

    const item = document?.item ?? document;

    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
      Inventory.isItemInventoryType(item)
    );
  });
}

function getEncounterLegacyPins(
  sheetDocument: any,
  tabId: string,
  pins: (SheetPinContext | AnySheetPinFlagData)[],
) {
  if (tabId === CONSTANTS.TAB_MEMBERS) {
    return pins;
  }

  return pins.filter((pin) => {
    const document = fromUuidSync(pin.id, { relative: sheetDocument });

    const item = document?.item ?? document;

    if (!item) {
      return false;
    }

    return (
      tabId === CONSTANTS.TAB_ACTOR_INVENTORY &&
      Inventory.isItemInventoryType(item)
    );
  });
}
