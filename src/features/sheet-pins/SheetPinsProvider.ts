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
    sheetDocument: Actor5e | Item5e,
  ): Promise<TabIdsToSheetPinsContext> {
    let pinsContext = TidyFlags.sheetPins.get(sheetDocument);

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
    }

    return result;
  }

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

  static isPinned(targetDocument: Item5e | Activity5e, tabId: string): boolean {
    const pins = targetDocument.actor
      ? getSheetPinFlagsForTab(targetDocument.actor, tabId)
      : [];

    const relativeUuid = this.getRelativeUUID(targetDocument);

    return pins.some((x) => x.id === relativeUuid);
  }

  static async pin(targetDocument: any, type: SheetPin['type'], tabId: string) {
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

    const pins = getSheetPinFlagsForTab(targetDocument.actor, tabId);

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

    return TidyFlags.sheetPins.setByTabId(targetDocument.actor, tabId, newPins);
  }

  static async unpin(targetDocument: Item5e | Activity5e, tabId: string) {
    if (!targetDocument.actor || !this.isPinned(targetDocument, tabId)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pins = getSheetPinFlagsForTab(targetDocument.actor, tabId);

    let newPins = pins.filter((x) => x.id !== relativeUuid);

    newPins = await preparePinsForForSaving(targetDocument, newPins);

    return TidyFlags.sheetPins.setByTabId(targetDocument.actor, tabId, newPins);
  }

  static getRelativeUUID(doc: any) {
    return doc.getRelativeUUID?.(doc.actor) ?? doc.relativeUUID;
  }

  static async setItemResourceType(
    targetDocument: Item5e,
    tabId: string,
    resourceType: SheetItemPinFlag['resource'],
  ) {
    let pins = getSheetPinFlagsForTab(targetDocument.actor, tabId);

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.resource = resourceType;
    }

    pins = await preparePinsForForSaving(targetDocument, pins);

    return TidyFlags.sheetPins.setByTabId(targetDocument.actor, tabId, pins);
  }

  static async setAlias(
    targetDocument: Item5e | Activity5e,
    tabId: string,
    alias: string,
  ) {
    let pins = getSheetPinFlagsForTab(targetDocument.actor, tabId);

    const relativeUuid = this.getRelativeUUID(targetDocument);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.alias = alias;
    }

    pins = await preparePinsForForSaving(targetDocument, pins);

    return TidyFlags.sheetPins.setByTabId(targetDocument.actor, tabId, pins);
  }

  static getResourceType(
    targetDocument: Item5e | Activity5e,
    tabId: string,
  ): string | undefined {
    const relativeUuid = this.getRelativeUUID(targetDocument);

    return getSheetPinFlagsForTab(targetDocument.actor, tabId)?.find(
      (x) => x.id === relativeUuid,
    )?.resource;
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

  static sortPins(
    sheetDocument: Actor5e | Item5e,
    tabId: string,
    srcId: string,
    targetId: string,
  ) {
    let source;
    let target;

    const pinFlags = getSheetPinFlagsForTab(sheetDocument, tabId);

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

    return TidyFlags.sheetPins.setByTabId(
      sheetDocument,
      tabId,
      Array.from(pins.values()),
    );
  }
}

function getSheetPinFlagsForTab(
  sheetDocument: Actor5e | Item5e,
  tabId: string,
) {
  let pinsByTabId = TidyFlags.sheetPins.get(sheetDocument);

  return (
    pinsByTabId[tabId] ?? pinsByTabId[CONSTANTS.PARTITION_MODULE_DEFAULT] ?? []
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
