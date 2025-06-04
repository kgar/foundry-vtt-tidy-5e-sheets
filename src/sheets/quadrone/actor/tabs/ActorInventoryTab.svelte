<script lang="ts">
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import { CONSTANTS } from 'src/constants';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import ItemTables from 'src/sheets/quadrone/shared/ItemTables.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    CharacterSheetQuadroneContext,
    InventorySection,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext, type Component } from 'svelte';
  import AttuneButton from 'src/components/table-quadrone/table-buttons/AttuneButton.svelte';
  import EquipButton from 'src/components/table-quadrone/table-buttons/EquipButton.svelte';
  import BookmarkButton from 'src/components/table-quadrone/table-buttons/BookmarkButton.svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let searchCriteria = $state('');

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let inventory = $derived(
    SheetSections.configureInventory(
      context.inventory,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: inventory,
      tabId: tabId,
    });
  });

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    Item5e,
    InventorySection
  >;

  let rowActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    if (context.owner) {
      result.push({
        component: AttuneButton,
        props: (doc: any) => ({ doc }),
      } satisfies TableAction<typeof AttuneButton>);

      result.push({
        component: EquipButton,
        props: (doc: any) => ({ doc }),
      } satisfies TableAction<typeof EquipButton>);

      result.push({
        component: BookmarkButton,
        props: (doc: any) => ({ doc }),
      } satisfies TableAction<typeof BookmarkButton>);

      if (context.unlocked) {
        result.push({
          component: EditButton,
          props: (doc: any) => ({ doc }),
        } satisfies TableAction<typeof EditButton>);

        result.push({
          component: DeleteButton,
          props: (doc: any) => ({
            doc,
            deleteFn: () => doc.deleteDialog(),
          }),
        } satisfies TableAction<typeof DeleteButton>);
      }
    }

    return result;
  });
</script>

<p>TODO: Search, Filter, Controls bar</p>

<ItemTables
  {rowActions}
  sections={inventory}
  editable={context.editable}
  itemContext={context.itemContext}
  {inlineToggleService}
  sheetDocument={context.actor}
  unlocked={context.unlocked}
  root={true}
/>
