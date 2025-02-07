<script lang="ts">
  import TidyTable, {
    type TidyTableColumns,
  } from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { Actor5e, InventorySection } from 'src/types/types';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import InlineContainerView from './InlineContainerView.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import InlineItemQuantityTracker from 'src/components/trackers/InlineItemQuantityTracker.svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';

  interface Props {
    contents: InventorySection[];
    container: Item5e;
    editable: boolean;
    itemContext: Record<string, ContainerItemContext>;
    inlineToggleService: InlineToggleService;
    lockItemQuantity: boolean;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    unlocked?: boolean;
  }

  let {
    contents,
    container,
    editable,
    itemContext,
    inlineToggleService,
    lockItemQuantity,
    sheetDocument,
    unlocked = true,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let configuredContents = $derived(
    SheetSections.configureInventory(
      contents.filter((i) => i.items.length),
      tabId,
      SheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(container)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );

  const searchResults = getSearchResultsContext();

  // let itemActions: {
  //   component: Component;
  //   getProps: (item: Item5e) => any;
  // }[] = [];

  // $: {
  //   itemActions = [];

  //   if (unlocked) {
  //     itemActions.push({
  //       component: ItemEditControl,
  //       getProps: (item: Item5e) => ({ item }),
  //     });

  //     itemActions.push({
  //       component: ItemDeleteControl,
  //       getProps: (item: Item5e) => ({
  //         item,
  //         deleteFn: () => item.deleteDialog(),
  //       }),
  //     });
  //   }
  // }

  const weightUnit = FoundryAdapter.getWeightUnit();

  let useClassicControls = $derived(
    FoundryAdapter.useClassicControls(container),
  );

  // TODO: Allow the user to choose which icons are priority and can be shown in the actions column

  let gridTemplateColumns: TidyTableColumns = $derived.by(() => {
    let result: TidyTableColumns = [
      {
        name: 'Name',
        width: '1fr',
      },
      {
        name: 'Quantity',
        width: '4.125rem',
      },
      {
        name: 'Weight',
        width: '2.25rem',
      },
    ];

    if (useClassicControls) {
      result.push({
        name: 'Actions',
        width: `${1.5 * (unlocked ? 3 : 1)}rem`,
      });
    }

    return result;
  });

  let containerToggleMap = $derived(inlineToggleService.map);

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {@const itemEntries = section.items.map((item) => ({
    item,
    ctx: itemContext[item.id],
  }))}

  {#if section.show}
    <TidyTable
      key={section.key}
      data-custom-section={section.custom ? true : null}
    >
      {#snippet header()}
        <TidyTableHeaderRow class="dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.items.length}</span>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            <div class="cell-name">
              {localize('DND5E.Quantity')}
            </div>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell>
            <div class="cell-name">
              {localize('DND5E.Weight')}
            </div>
          </TidyTableHeaderCell>
          <TidyTableHeaderCell class="header-cell-actions">
            <!-- Actions -->
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each itemEntries as { item, ctx }, i (item.id)}
          {@const weight = ctx?.totalWeight ?? item.system.weight.value}
          {@const itemBorderColor = item.system.rarity
            ? `var(--t5e-color-rarity-${item.system.rarity.slugify()})`
            : 'var(--t5e-color-gold)'}
          {@const showRarityBoxShadow = [
            'veryRare',
            'legendary',
            'artifact',
          ].includes(item.system.rarity)}

          <ItemTableRowV2
            {item}
            hidden={!searchResults.show(item.uuid)}
            rowClass={FoundryAdapter.getInventoryRowClasses(
              item,
              itemContext[item.id]?.attunement,
            )}
            contextMenu={{
              type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
              uuid: item.uuid,
            }}
          >
            {#snippet children({ toggleSummary })}
              <a
                class="tidy-table-button item-use-button"
                style="--item-border-color: {itemBorderColor};"
                class:special-rarity={showRarityBoxShadow}
                onclick={(ev) => FoundryAdapter.actorTryUseItem(item, ev)}
              >
                <img class="item-image" alt="" src={item.img} />
                <span class="roll-prompt">
                  <i class="fa fa-dice-d20"></i>
                </span>
              </a>
              <TidyTableCell primary={true} class="item-label text-cell">
                {#if 'containerContents' in ctx && !!ctx.containerContents}
                  <a
                    class="expand-indicator-button"
                    onclick={() => inlineToggleService.toggle(tabId, item.id)}
                  >
                    <i
                      class="fa-solid fa-angle-right expand-indicator"
                      class:expanded={containerToggleMap
                        .get(tabId)
                        ?.has(item.id)}
                    >
                    </i>
                  </a>
                {/if}
                <a class="item-name truncate" onclick={(ev) => toggleSummary()}>
                  <span class="cell-name">{item.name}</span>
                </a>
              </TidyTableCell>
              <TidyTableCell>
                <InlineItemQuantityTracker {item} disabled={!item.isOwner} />
              </TidyTableCell>
              <TidyTableCell>
                {weight}
              </TidyTableCell>
              <TidyTableCell class="item-actions">
                {#if unlocked}
                  <EditButton doc={item} />
                  <DeleteButton
                    doc={item}
                    deleteFn={() => item.deleteDialog()}
                  />
                {/if}
                <MenuButton targetSelector="[data-item-id]" />
              </TidyTableCell>
            {/snippet}
          </ItemTableRowV2>

          {#if 'containerContents' in ctx && !!ctx.containerContents}
            <InlineContainerView
              container={item}
              containerContents={ctx.containerContents}
              {editable}
              {inlineToggleService}
              {lockItemQuantity}
              {sheetDocument}
              {unlocked}
            />
          {/if}
        {/each}
      {/snippet}
    </TidyTable>
  {/if}
{/each}
