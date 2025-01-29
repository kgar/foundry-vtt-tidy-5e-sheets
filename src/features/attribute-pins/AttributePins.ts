import { TidyFlags } from 'src/api';
import type { Item5e } from 'src/types/item.types';
import { error } from 'src/utils/logging';

export class AttributePins {
  static isPinnable(item: Item5e): boolean {
    return !!item.system.schema.fields.uses;
  }

  static isPinned(item: Item5e): boolean {
    const flagPins = item.parent
      ? TidyFlags.attributePins.get(item.parent)
      : [];
    const relativeUuid = item.getRelativeUUID(item.parent);
    return flagPins.some((x) => x.id === relativeUuid);
  }

  static pin(item: Item5e) {
    if (!item.parent || this.isPinned(item)) {
      return;
    }

    const relativeUuid = item.getRelativeUUID(item.parent);

    if (
      relativeUuid.startsWith('.') &&
      fromUuidSync(relativeUuid, { relative: item.parent }) === null
    ) {
      // Assume that an ID starting with a "." is a relative ID.
      error(
        `The item with id ${item.id} is not owned by actor ${item.parent.id}`
      );
      return;
    }

    const flagPins = TidyFlags.attributePins.get(item.parent);

    let maxSort = 0;
    const newPins = flagPins.map((p) => {
      if (p.sort > maxSort) maxSort = p.sort;
      return { ...p };
    });

    newPins.push({
      id: relativeUuid,
      sort: maxSort + CONST.SORT_INTEGER_DENSITY,
    });
    return TidyFlags.attributePins.set(item.parent, newPins);
  }

  static unpin(item: Item5e) {
    if (!item.parent || !this.isPinned(item)) {
      return;
    }

    const flagPins = TidyFlags.attributePins.get(item.parent);
    const relativeUuid = item.getRelativeUUID(item.parent);
    const newPins = flagPins.filter((x) => x.id !== relativeUuid);
    return TidyFlags.attributePins.set(item.parent, newPins);
  }
}
