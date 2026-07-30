import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';
import type { SheetItemPinFlag, SheetPin } from 'src/foundry/TidyFlags.types';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { CONSTANTS } from 'src/constants';
import type {
  Actor5e,
  SheetPinContext,
  TabIdsToSheetPinsContext,
} from 'src/types/types';
import { Activities } from '../activities/activities';
import { legacyGetAppropriateSheetPins } from './legacy-sheet-pins-functions';

/**
 * The controller/manager for all things related to Sheet Pins.
 * Also the layer of abstraction between sheets/components and the
 * underlying sheet pin flag data.
 */
export class SheetPinsProvider {
  /**
   * Gets all sheet pins for a given document, partitioned by tab ID.
   * @param sheetDocument the document which owns the sheet pins
   * @returns a record of tab IDs to sheet pins, e.g., `{ inventory: [...], action: [...], features: [...] }`
   */
  static async getSheetPinsContext(
    sheetDocument: Actor5e | Item5e,
  ): Promise<TabIdsToSheetPinsContext> {
    let pinsContext = TidyFlags.tabSheetPins.get(sheetDocument);

    let result: TabIdsToSheetPinsContext = {};

    for (const [tabId, flagPins] of Object.entries(pinsContext)) {
      const pins: SheetPinContext[] = [];
      result[tabId] = pins;
      for (const pin of flagPins) {
        let document = await fromUuid(pin.id, { relative: sheetDocument });

        if (!document) {
          continue;
        }

        if (pin.type === 'item') {
          pins.push({
            ...pin,
            linkedUses: Activities.getLinkedUses(document),
            document,
          });
        } else if (pin.type === 'activity') {
          pins.push({
            ...pin,
            document,
          });
        }
      }

      pins.sort((a, b) => a.sort - b.sort);
    }

    return result;
  }

  /**
   * Determines if a document can be pinned.
   * @param targetDocument the document to be pinned
   * @param type the type of document being pinned, e.g., "item" or "activity"
   * @returns `true` if the document is pinnable
   */
  static isPinnable(
    targetDocument: Item5e | Activity5e,
    type: SheetPin['type'],
  ): boolean {
    return type === 'item'
      ? !!targetDocument.system.schema.fields.uses ||
          targetDocument.type === CONSTANTS.ITEM_TYPE_CONTAINER
      : type === 'activity'
        ? !!targetDocument.schema.fields.uses
        : false;
  }

  /**
   * Determines if a document is currently pinned to a specific tab
   * @param targetDocument the document whose pin status should be checked
   * @param tabId the ID for the relevant tab
   * @returns `true` if the document is pinned to the target tab
   */
  static isPinned(targetDocument: Item5e | Activity5e, tabId: string): boolean {
    const pins = targetDocument.actor
      ? getSheetPinsForTab(targetDocument.actor, tabId)
      : [];

    const relativeUuid = this.getRelativeUUID(targetDocument);

    return pins.some((x) => x.id === relativeUuid);
  }

  /**
   * Pins a target document to a specific tab of the sheet document.
   * @param targetDocument the document to be pinned
   * @param tabId the ID of the tab where the document should be pinned
   * @param type the type of document to be pinned, e.g., "item" or "activity"
   * @returns the result of updating the parent document's flags
   */
  static async pin(targetDocument: any, tabId: string, type: SheetPin['type']) {
    if (!targetDocument.actor || this.isPinned(targetDocument, tabId)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(targetDocument);

    if (
      relativeUuid.startsWith('.') &&
      (await fromUuid(relativeUuid, { relative: targetDocument.actor })) ===
        null
    ) {
      // Assume that an ID starting with a "." is a relative ID.
      error(
        `The item with id ${targetDocument.id} is not owned by actor ${targetDocument.actor.id}`,
      );
      return;
    }

    const pins = getSheetPinsForTab(targetDocument.actor, tabId);

    let maxSort = 0;
    let newPins = pins.map((p) => {
      if (p.sort > maxSort) maxSort = p.sort;
      return { ...p };
    });

    if (type === 'activity') {
      newPins.push({
        type: 'activity',
        id: relativeUuid,
        sort: maxSort + CONST.SORT_INTEGER_DENSITY,
        resource: 'limited-uses',
      });
    } else if (type === 'item') {
      newPins.push({
        type: 'item',
        id: relativeUuid,
        sort: maxSort + CONST.SORT_INTEGER_DENSITY,
        resource:
          targetDocument.type === CONSTANTS.ITEM_TYPE_CONSUMABLE
            ? 'quantity'
            : 'limited-uses',
      });
    }

    newPins = await preparePinsForForSaving(targetDocument, newPins);

    return TidyFlags.tabSheetPins.setByTabId(
      targetDocument.actor,
      tabId,
      newPins,
    );
  }

  /**
   * Unpins a target document from a specific tab of the related sheet document.
   * @param targetDocument the document to be unpinned
   * @param tabId the ID of the tab where the document should be unpinned
   * @returns the result of updating the parent document's flags
   */
  static async unpin(targetDocument: Item5e | Activity5e, tabId: string) {
    if (!targetDocument.actor || !this.isPinned(targetDocument, tabId)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pins = getSheetPinsForTab(targetDocument.actor, tabId);

    let newPins = pins.filter((x) => x.id !== relativeUuid);

    newPins = await preparePinsForForSaving(targetDocument, newPins);

    return TidyFlags.tabSheetPins.setByTabId(
      targetDocument.actor,
      tabId,
      newPins,
    );
  }

  /**
   * Gets the relative UUID of a given document. For use with favorite-like settings which store a relative UUID, such as sheet pins.
   * @param targetDocument the document whose relative UUID should be retrieved
   * @returns the relative UUID of a document, or the UUID minus the leading prefix which denotes the top-level document ancestor
   */
  static getRelativeUUID(targetDocument: any) {
    return (
      targetDocument.getRelativeUUID?.(targetDocument.actor) ??
      targetDocument.relativeUUID
    );
  }

  static async setItemResourceType(
    targetDocument: Item5e,
    tabId: string,
    resourceType: SheetItemPinFlag['resource'],
  ) {
    let pins = getSheetPinsForTab(targetDocument.actor, tabId);

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.resource = resourceType;
    }

    pins = await preparePinsForForSaving(targetDocument, pins);

    return TidyFlags.tabSheetPins.setByTabId(targetDocument.actor, tabId, pins);
  }

  /**
   * Sets an alias for a given sheet pin on a given tab
   * @param targetDocument the document whose pin data should be updated
   * @param tabId the ID of the tab where the pin settings should be updated
   * @param alias the alias to apply to the sheet pin
   * @returns the result of updating the parent document's flags
   */
  static async setAlias(
    targetDocument: Item5e | Activity5e,
    tabId: string,
    alias: string,
  ) {
    let pins = getSheetPinsForTab(targetDocument.actor, tabId);

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.alias = alias;
    }

    pins = await preparePinsForForSaving(targetDocument, pins);

    return TidyFlags.tabSheetPins.setByTabId(targetDocument.actor, tabId, pins);
  }

  /**
   * Determines what resource type is currently configured for a pinned document on a given tab.
   * @param targetDocument the document whose pin data should be checked
   * @param tabId tha ID of the tab where the pins settings should be checked
   * @returns the resource type, e.g., "limited-uses" or "quantity"
   */
  static getResourceType(
    targetDocument: Item5e | Activity5e,
    tabId: string,
  ): string | undefined {
    const relativeUuid = this.getRelativeUUID(targetDocument);

    return getSheetPinsForTab(targetDocument.actor, tabId)?.find(
      (x) => x.id === relativeUuid,
    )?.resource;
  }

  /**
   * Sorts pins based on a drag/drop from source to target.
   * @param sheetDocument the document which owns the pins
   * @param tabId the tab ID where the pins should be sorted
   * @param srcId the ID of the pin which was dragged
   * @param targetId the ID of the pin which received a dropped pin
   * @returns the result of updating the parent document's flags
   */
  static sortPins(
    sheetDocument: Actor5e | Item5e,
    tabId: string,
    srcId: string,
    targetId: string,
  ) {
    let source;
    let target;

    const pinFlags = getSheetPinsForTab(sheetDocument, tabId);

    const siblings = [...pinFlags].filter((f: SheetPin) => {
      if (f.id === targetId) target = f;
      else if (f.id === srcId) source = f;
      return f.id !== srcId;
    });

    const updates = foundry.utils.performIntegerSort(source, {
      target,
      siblings,
    });

    const pins = [...pinFlags].reduce(
      (map: Map<string, SheetPin>, f: SheetPin) => map.set(f.id, { ...f }),
      new Map<string, SheetPin>(),
    );

    for (const { target, update } of updates) {
      const pin = pins.get(target.id);
      if (pin && update) {
        foundry.utils.mergeObject(pin, update);
      }
    }

    return TidyFlags.tabSheetPins.setByTabId(
      sheetDocument,
      tabId,
      Array.from(pins.values()),
    );
  }

  /**
   * Gets the sheet pin context entries for displaying on a given tab.  
   * **Note**: This method provides temporary support for reading the legacy / fallback partition
   * which is part of the previous version of sheet pins. Without calling this method,
   * we no longer support a rolling update with backwards compatibility.  
   * Support for backwards compatibility here should last while game.release.generation < 17
   * @param sheetDocument the document which owns the pins
   * @param sheetPins the sheet pins context prepared by the sheet
   * @param tabId the tab ID where the sheet pins should be displayed
   * @returns an array of sheet pin contexts with the data needed to properly display the pins
   */
  static getSheetPinContextsToDisplay(
    sheetDocument: any,
    sheetPins: TabIdsToSheetPinsContext,
    tabId: string,
  ) {
    return (
      sheetPins[tabId] ??
      legacyGetAppropriateSheetPins(
        sheetDocument,
        tabId,
        sheetPins[CONSTANTS.PARTITION_MODULE_DEFAULT],
      ) ??
      []
    );
  }
}

function getSheetPinsForTab(sheetDocument: Actor5e | Item5e, tabId: string) {
  let pinsByTabId = TidyFlags.tabSheetPins.get(sheetDocument);

  return (
    pinsByTabId[tabId] ??
    legacyGetAppropriateSheetPins(
      sheetDocument,
      tabId,
      pinsByTabId[CONSTANTS.PARTITION_MODULE_DEFAULT],
    ) ??
    []
  );
}

async function preparePinsForForSaving(targetDocument: any, pins: SheetPin[]) {
  let pinsToSave = [];

  for (let pin of pins) {
    if (await fromUuid(pin.id, { relative: targetDocument.actor })) {
      pinsToSave.push(pin);
    }
  }

  return pinsToSave;
}
