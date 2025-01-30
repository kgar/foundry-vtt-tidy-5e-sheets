import { TidyFlags } from 'src/api';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';
import type { AttributePin } from 'src/foundry/TidyFlags.types';
import type { Activity5e } from 'src/foundry/dnd5e.types';

export class AttributePins {
  static isPinnable(
    doc: Item5e | Activity5e,
    type: AttributePin['type']
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

  static pin(doc: any, type: AttributePin['type']) {
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
    const newPins = flagPins.map((p) => {
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
        resource: 'limited-uses',
      });
    }
    return TidyFlags.attributePins.set(doc.actor, newPins);
  }

  static unpin(doc: Item5e | Activity5e) {
    if (!doc.actor || !this.isPinned(doc)) {
      return;
    }

    const flagPins = TidyFlags.attributePins.get(doc.actor);

    const relativeUuid = this.getRelativeUUID(doc);

    const newPins = flagPins.filter((x) => x.id !== relativeUuid);

    return TidyFlags.attributePins.set(doc.actor, newPins);
  }

  private static getRelativeUUID(doc: any) {
    return doc.getRelativeUUID?.(doc.actor) ?? doc.relativeUUID;
  }
}
