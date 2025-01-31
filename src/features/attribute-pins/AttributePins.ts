import { TidyFlags } from 'src/api';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';
import type {
  AttributeItemPinFlag,
  AttributePinFlag,
} from 'src/foundry/TidyFlags.types';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { CONSTANTS } from 'src/constants';

export class AttributePins {
  static isPinnable(
    doc: Item5e | Activity5e,
    type: AttributePinFlag['type']
  ): boolean {
    return type === 'item'
      ? !!doc.system.schema.fields.uses
      : type === 'activity'
      ? !!doc.schema.fields.uses
      : false;
  }

  static isPinned(doc: any): boolean {
    const flagPins = doc.actor ? TidyFlags.attributePins.get(doc.actor) : [];

    const relativeUuid = this.getRelativeUUID(doc);

    return flagPins.some((x) => x.id === relativeUuid);
  }

  static pin(doc: any, type: AttributePinFlag['type']) {
    if (!doc.actor || this.isPinned(doc)) {
      return;
    }

    const relativeUuid = this.getRelativeUUID(doc);

    if (
      relativeUuid.startsWith('.') &&
      fromUuidSync(relativeUuid, { relative: doc.actor }) === null
    ) {
      // Assume that an ID starting with a "." is a relative ID.
      error(`The item with id ${doc.id} is not owned by actor ${doc.actor.id}`);
      return;
    }

    const flagPins = TidyFlags.attributePins.get(doc.actor);

    let maxSort = 0;
    let newPins = flagPins.map((p) => {
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

    newPins = this.preparePinsForForSaving(doc, newPins);

    return TidyFlags.attributePins.set(doc.actor, newPins);
  }

  static unpin(doc: Item5e | Activity5e) {
    if (!doc.actor || !this.isPinned(doc)) {
      return;
    }

    const flagPins = TidyFlags.attributePins.get(doc.actor);

    const relativeUuid = this.getRelativeUUID(doc);

    let newPins = flagPins.filter((x) => x.id !== relativeUuid);

    newPins = this.preparePinsForForSaving(doc, newPins);

    return TidyFlags.attributePins.set(doc.actor, newPins);
  }

  private static getRelativeUUID(doc: any) {
    return doc.getRelativeUUID?.(doc.actor) ?? doc.relativeUUID;
  }

  static selectItemResourceType(
    item: Item5e,
    resourceType: AttributeItemPinFlag['resource']
  ) {
    let pins = TidyFlags.attributePins.get(item.actor);

    const relativeUuid = this.getRelativeUUID(item);

    const pinToUpdate = pins.find((x) => x.id === relativeUuid);

    if (pinToUpdate) {
      pinToUpdate.resource = resourceType;
    }

    pins = this.preparePinsForForSaving(item, pins);

    return TidyFlags.attributePins.set(item.actor, pins);
  }

  static preparePinsForForSaving(pinnedDoc: any, pins: AttributePinFlag[]) {
    return pins.filter(
      (x) => !!fromUuidSync(x.id, { relative: pinnedDoc.actor })
    );
  }

  static getResourceType(doc: any): string | undefined {
    const relativeUuid = this.getRelativeUUID(doc);

    return TidyFlags.attributePins
      .get(doc.actor)
      ?.find((x) => x.id === relativeUuid)?.resource;
  }
}
