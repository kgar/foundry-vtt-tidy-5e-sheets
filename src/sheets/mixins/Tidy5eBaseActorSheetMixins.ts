import { TidyFlags } from 'src/api';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

export function ActorSheetCustomSectionMixin<
  T extends new (...args: any[]) => {
    actor: Actor5e;
    _onSortItem(
      event: DragEvent,
      itemData: Record<string, unknown>
    ): Promise<any> | void;
  }
>(Base: T) {
  return class extends Base {
    // TODO: Fully implement this functionality as a dedicated effort and track on this github issue: https://github.com/kgar/foundry-vtt-tidy-5e-sheets/issues/567
    /**
     * For items the actor already owns, if the item is dragged to a different section, add the item to the section instead. 
     * Then, sort item as usual.
     * @param event an item has been dropped
     * @param itemData the item class instance, put to an object
     */
    // async _onSortItem(event: DragEvent, itemData: Record<string, unknown>) {
    //   const sourceSection = foundry.utils.getProperty(
    //     itemData,
    //     TidyFlags.section.prop
    //   );

    //   // Get target section
    //   const targetSection = (event.target as HTMLElement | null)
    //     ?.closest('[data-tidy-section-key]')
    //     ?.getAttribute('data-tidy-section-key');

    //   const isMovedToNewSection =
    //     !isNil(targetSection?.trim(), '') && sourceSection !== targetSection;

    //   await super._onSortItem(event, itemData);

    //   if (isMovedToNewSection) {
    //     const item = this.actor.items.get(itemData._id);
    //     return TidyFlags.section.set(item, targetSection);
    //   }
    // }
  };
}
