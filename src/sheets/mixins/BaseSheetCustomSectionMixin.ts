import { TidyFlags } from 'src/foundry/TidyFlags';
import type { Item5e } from 'src/types/item.types';
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
    _onSortItem(
      event: DragEvent,
      itemData: Record<string, unknown>
    ): Promise<any> | void;
    _event: Event;
    _onDropItemCreate(itemData: Record<string, unknown>): Promise<unknown>;
    object: any;
  }
>(itemsFn: OwnedItemsFunction, Base: T) {
  return class extends Base {
    async _onSortItem(event: DragEvent, itemData: Record<string, unknown>) {
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

      const initialSortResult = await super._onSortItem(event, itemData);

      const item = itemsFn(this.object).get(itemData._id as string);

      return isMovedToNewSection
        ? TidyFlags.section.set(item, targetSection)
        : isMovedToDefaultSection
        ? TidyFlags.section.unset(item)
        : initialSortResult;
    }
  };
}
