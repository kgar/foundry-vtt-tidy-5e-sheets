import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from './foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type { ActorSectionOrder } from 'src/features/sections/sections.types';

/** Manages Tidy flags. */
export class TidyFlags {
  /**
   * Determines whether an item whose default Action List behavior has been overridden
   * to be included (`true`) or excluded (`false`).
   * `undefined` means there is no override and standard Action List logic should be used.
   * */
  static actionFilterOverride = {
    key: 'action-filter-override' as const,
    /** Gets the item's Action Filter Override setting. */
    get(item: Item5e): boolean | undefined {
      return (
        FoundryAdapter.tryGetFlag<boolean>(
          item,
          TidyFlags.actionFilterOverride.key
        ) ?? undefined
      );
    },
    /** Sets the item's Action Filter Override setting. */
    set(item: Item5e, value: boolean): Promise<void> {
      return FoundryAdapter.setFlag(
        item,
        TidyFlags.actionFilterOverride.key,
        value
      );
    },
    /**
     * Clears the item's Action Filter Override setting,
     * meaning the item should use the standard Action List logic
     * for inclusion or exclusion. */
    unset(item: Item5e) {
      return FoundryAdapter.unsetFlag(item, TidyFlags.actionFilterOverride.key);
    },
  };

  /** Determines the order of item table sections for a given actor. */
  static actorSectionOrder = {
    key: 'actor-section-order' as const,
    /** Gets the actor's section ordering. `undefined` means to use the default order.  */
    get(actor: Actor5e): ActorSectionOrder | undefined {
      return (
        FoundryAdapter.tryGetFlag<ActorSectionOrder>(
          actor,
          TidyFlags.actorSectionOrder.key
        ) ?? undefined
      );
    },
    /** Sets the actor's section ordering. */
    set(actor: Actor5e, value: ActorSectionOrder) {
      return FoundryAdapter.setFlag(
        actor,
        TidyFlags.actorSectionOrder.key,
        value
      );
    },
    /**
     * Clears the actor's section ordering,
     * meaning the target actor should use default ordering.
     * */
    unset(actor: Actor5e) {
      return FoundryAdapter.unsetFlag(actor, TidyFlags.actorSectionOrder.key);
    },
  };
}