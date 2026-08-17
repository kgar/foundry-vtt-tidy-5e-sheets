import type { SearchResultsState } from 'src/features/search/search.svelte';
import type { ContainerContents, Item5e } from 'src/types/item.types';
import type { Actor5e, ActionItem } from 'src/types/types';
import { ItemVisibility } from './ItemVisibility';

export type SectionMemberContext = { actor: Actor5e };

export type SectionSearchState = {
  isSearching: boolean;
  hasViewableItems: boolean;
  visibleItemCount: number;
  expandedOverride: boolean | undefined;
};

export type SectionVisibilityOptions = {
  /** Show if unlocked. */
  unlocked?: boolean;
  /** Show the section always (e.g. has spell slots) */
  alwaysShow?: boolean;
  /** Show while searching (e.g. cantrips, innate) */
  showWhileSearching?: boolean;
};

export class SectionVisibility {
  static getItemSectionSearchState(
    items: Item5e[],
    searchResults: SearchResultsState,
  ): SectionSearchState {
    return SectionVisibility.toSearchState(
      searchResults.isSearching,
      ItemVisibility.countVisibleItems(items, searchResults.uuids),
    );
  }

  static getMemberSectionSearchState(
    members: SectionMemberContext[],
    searchResults: SearchResultsState,
  ): SectionSearchState {
    return SectionVisibility.toSearchState(
      searchResults.isSearching,
      members.reduce(
        (prev, curr) => prev + (searchResults.show(curr.actor.uuid) ? 1 : 0),
        0,
      ),
    );
  }

  static shouldShowItemSection(
    searchState: SectionSearchState,
    options: SectionVisibilityOptions = {},
  ): boolean {
    if (searchState.hasViewableItems) {
      return true;
    }

    if (options.alwaysShow) {
      return true;
    }

    // A search means the user asked to see only what matched, unless the
    // section is one which holds its place to keep the layout readable.
    if (searchState.isSearching) {
      return !!options.showWhileSearching;
    }

    // An empty section is still worth showing while the user is managing.
    return !!options.unlocked;
  }

  static shouldShowMemberSection(searchState: SectionSearchState): boolean {
    return searchState.hasViewableItems || !searchState.isSearching;
  }

  static syncItemTabSearchResults(
    searchResults: SearchResultsState,
    criteria: string,
    args: {
      tabId: string;
      itemContext: Record<string, { containerContents?: ContainerContents }>;
      sections: ({ items: Item5e[] } | { actions: ActionItem[] })[];
    },
  ) {
    searchResults.criteria = criteria;
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria,
      ...args,
    });
  }

  private static toSearchState(
    isSearching: boolean,
    visibleItemCount: number,
  ): SectionSearchState {
    const hasViewableItems = visibleItemCount > 0;

    return {
      isSearching,
      hasViewableItems,
      visibleItemCount,
      expandedOverride: isSearching ? hasViewableItems : undefined,
    };
  }
}
