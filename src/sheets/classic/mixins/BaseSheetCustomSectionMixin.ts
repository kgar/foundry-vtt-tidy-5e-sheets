import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DropEffectValue } from 'src/mixins/DragAndDropBaseMixin';
import type { Item5e } from 'src/types/item.types';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

/**
 * A function which returns the items that are visualized by the target sheet.
 */
type OwnedItemsFunction = (object: any) => Map<string, Item5e>;

/**
 * A mixin which supports drag-and-drop behaviors specifically catered to
 * Tidy 5e sheets with item lists and custom sections.
 * @param itemsFn A function which returns the items that are visualized by the target sheet.
 * @param Base The base document to extend with this mixin.
 * @returns The base document with custom section logic mixed in.
 */
export function BaseSheetCustomSectionMixin<
  T extends new (...args: any[]) => {
    _onDropItemCreate(item: any, event: DragEvent, behavior: DropEffectValue): Promise<any> | void;
    _onSortItem(
      event: DragEvent,
      itemData: Record<string, unknown>,
      allowSectionTransfer?: boolean
    ): Promise<any> | void;
    actor: Actor5e;
    object: any;
    _dropBehavior: (event: DragEvent, data: any) => DropEffectValue;
  }
>(itemsFn: OwnedItemsFunction, Base: T) {
  return class extends Base {
    async _onDropItem(event: DragEvent, data: any) {
      const behavior = this._dropBehavior(event, data);

      if (!this.actor.isOwner || behavior === 'none') {
        return false;
      }

      const item = await Item.implementation.fromDropData(data);

      // Handle moving out of container & item sorting
      if (behavior === 'move' && this.actor.uuid === item.parent?.uuid) {
        const removingFromContainer = !isNil(item.system.container);
        if (removingFromContainer) {
          await item.update({ 'system.container': null });
        }
        return this._onSortItem(event, item.toObject(), !removingFromContainer);
      }

      return this._onDropItemCreate(item, event, behavior);
    }

    async _onSortItem(
      event: DragEvent,
      itemData: Record<string, unknown>,
      allowSectionTransfer: boolean = true
    ) {
      const sourceSection = foundry.utils.getProperty(
        itemData,
        TidyFlags.section.prop
      );

      const targetSection = (event.target as HTMLElement | null)
        ?.closest('[data-tidy-section-key][data-custom-section="true"]')
        ?.getAttribute('data-tidy-section-key');

      const isMovedToNewSection =
        !isNil(targetSection?.trim(), '') && sourceSection !== targetSection;

      const isMovedToDefaultSection =
        !isNil(sourceSection?.trim(), '') && isNil(targetSection?.trim(), '');

      const initialSortResult = await FoundryAdapter.onSortItemForActor(
        this.actor,
        event,
        itemData
      );

      if (!allowSectionTransfer) {
        return initialSortResult;
      }

      const item = itemsFn(this.object).get(itemData._id as string);

      return isMovedToNewSection
        ? TidyFlags.section.set(item, targetSection)
        : isMovedToDefaultSection
        ? TidyFlags.section.unset(item)
        : initialSortResult;
    }
  };
}
