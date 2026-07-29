import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';
import type { SheetItemPinFlag, SheetPin } from 'src/foundry/TidyFlags.types';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { CONSTANTS } from 'src/constants';
import { UserSheetPreferencesService } from '../user-preferences/SheetPreferencesService';
import type { BooleanSetting } from 'src/settings/editors/sheet-tab-options-settings-editor.svelte';
import type {
  Actor5e,
  SheetPinContext,
  TabIdsToSheetPinsContext,
} from 'src/types/types';
import { Activities } from '../activities/activities';

export class SheetPinsProvider {
  static async getSheetPinsContext(
    doc: Actor5e | Item5e,
  ): Promise<TabIdsToSheetPinsContext> {
    let pinsContext = TidyFlags.sheetPins.get(doc);

    let result: TabIdsToSheetPinsContext = {};

    for (const [tabId, flagPins] of Object.entries(pinsContext)) {
      const pins: SheetPinContext[] = [];
      result[tabId] = pins;
      for (const pin of flagPins) {
        let document = await fromUuid(pin.id, { relative: doc });

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
    }

    return result;
  }

  static isPinnable(doc: Item5e | Activity5e, type: SheetPin['type']): boolean {
    return type === 'item'
      ? !!doc.system.schema.fields.uses ||
          doc.type === CONSTANTS.ITEM_TYPE_CONTAINER
      : type === 'activity'
        ? !!doc.schema.fields.uses
        : false;
  }

  static isPinned(doc: Item5e | Activity5e, tabId: string): boolean {
    const pins = doc.actor ? getSheetPinFlagsForTab(doc.actor, tabId) : [];

    const relativeUuid = this.getRelativeUUID(doc);

    return pins.some((x) => x.id === relativeUuid);
  }

  static async pin(doc: any, type: SheetPin['type'], tabId: string) {
    if (!doc.actor || this.isPinned(doc, tabId)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(doc);

    if (
      relativeUuid.startsWith('.') &&
      (await fromUuid(relativeUuid, { relative: doc.actor })) === null
    ) {
      // Assume that an ID starting with a "." is a relative ID.
      error(`The item with id ${doc.id} is not owned by actor ${doc.actor.id}`);
      return;
    }

    const pins = getSheetPinFlagsForTab(doc.actor, tabId);

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
          doc.type === CONSTANTS.ITEM_TYPE_CONSUMABLE
            ? 'quantity'
            : 'limited-uses',
      });
    }

    newPins = await this.preparePinsForForSaving(doc, newPins);

    return TidyFlags.sheetPins.setByTabId(doc.actor, tabId, newPins);
  }

  static async unpin(doc: Item5e | Activity5e, tabId: string) {
    if (!doc.actor || !this.isPinned(doc, tabId)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(doc);

    const pins = getSheetPinFlagsForTab(doc.actor, tabId);

    let newPins = pins.filter((x) => x.id !== relativeUuid);

    newPins = await this.preparePinsForForSaving(doc, newPins);

    return TidyFlags.sheetPins.setByTabId(doc.actor, tabId, newPins);
  }

  static getRelativeUUID(doc: any) {
    return doc.getRelativeUUID?.(doc.actor) ?? doc.relativeUUID;
  }

  static async setItemResourceType(
    item: Item5e,
    tabId: string,
    resourceType: SheetItemPinFlag['resource'],
  ) {
    let pins = getSheetPinFlagsForTab(item.actor, tabId);

    const relativeUuid = this.getRelativeUUID(item);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.resource = resourceType;
    }

    pins = await this.preparePinsForForSaving(item, pins);

    return TidyFlags.sheetPins.setByTabId(item.actor, tabId, pins);
  }

  static async setAlias(doc: Item5e, tabId: string, alias: string) {
    let pins = getSheetPinFlagsForTab(doc.actor, tabId);

    const relativeUuid = this.getRelativeUUID(doc);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.alias = alias;
    }

    pins = await this.preparePinsForForSaving(doc, pins);

    return TidyFlags.sheetPins.setByTabId(doc.actor, tabId, pins);
  }

  static async preparePinsForForSaving(pinnedDoc: any, pins: SheetPin[]) {
    let pinsToSave = [];

    for (let pin of pins) {
      if (await fromUuid(pin.id, { relative: pinnedDoc.actor })) {
        pinsToSave.push(pin);
      }
    }

    return pinsToSave;
  }

  static getResourceType(doc: any, tabId: string): string | undefined {
    const relativeUuid = this.getRelativeUUID(doc);

    return getSheetPinFlagsForTab(doc.actor, tabId)?.find((x) => x.id === relativeUuid)
      ?.resource;
  }

  static getGlobalSectionSetting(
    documentType: string,
    tabId: string,
  ): BooleanSetting {
    return {
      type: 'boolean',
      label: 'TIDY5E.Utilities.ShowSheetPins',
      doc: game.user,
      prop: UserSheetPreferencesService.getTabProp(
        documentType,
        tabId,
        'showSheetPins',
        true,
      ),
      default: true,
      checked: UserSheetPreferencesService.getDocumentTypeTabPreference(
        documentType,
        tabId,
        'showSheetPins',
      ),
    };
  }

  static sortPins(doc: Actor5e | Item5e, tabId: string) {
    // TODO: Continue here
  }
}

function getSheetPinFlagsForTab(doc: Actor5e | Item5e, tabId: string) {
  let pinsByTabId = TidyFlags.sheetPins.get(doc.actor);

  return (
    pinsByTabId[tabId] ?? pinsByTabId[CONSTANTS.PARTITION_MODULE_DEFAULT] ?? []
  );
}
