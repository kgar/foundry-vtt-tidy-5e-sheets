<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { Actor5e, InventorySection } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { getContext, type Component, type ComponentProps } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import InlineContainerView from './InlineContainerView.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { ItemColumnRuntime } from 'src/runtime/item/ItemColumnRuntime.svelte';

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

  // TODO: File away
  type TidyTableAction<T extends Component<any>> = {
    component: T;
    props: (doc: any) => ComponentProps<T>;
  };

  let itemActions: TidyTableAction<any>[] = $derived.by(() => {
    let result: TidyTableAction<any>[] = [];

    if (unlocked) {
      result.push({
        component: EditButton,
        props: (doc: any) => ({ doc }),
      } satisfies TidyTableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (doc: any) => ({
          doc,
          deleteFn: () => doc.deleteDialog(),
        }),
      } satisfies TidyTableAction<typeof DeleteButton>);
    }

    return result;
  });

  let columnSpecs = $derived({
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + itemActions.length}) + var(--t5e-spacing-halfx))`,
    },
  });

  let containerToggleMap = $derived(inlineToggleService.map);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {#if section.show}
    {@const columns = ItemColumnRuntime.getSheetTabSectionColumnsQuadrone(
      container,
      tabId,
      section,
    )}
    <TidyTable
      key={section.key}
      data-custom-section={section.custom ? true : null}
    >
      {#snippet header()}
        <!-- TODO: Remove .dark for nested table header rows -->
        <TidyTableHeaderRow class="dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <h3>
              {localize(section.label)}
            </h3>
            <span class="table-header-count">{section.items.length}</span>
          </TidyTableHeaderCell>
          {#each columns as column}
            <TidyTableHeaderCell
              class={column.headerClasses ?? ''}
              columnWidth={column.width}
              hideUnder={column.hideUnder}
            >
              {#if column.headerContent.type === 'callback'}
                {@html column.headerContent.callback?.(
                  context.document,
                  context,
                )}
              {:else if column.headerContent.type === 'component'}
                <column.headerContent.component
                  sheetContext={context}
                  sheetDocument={context.document}
                />
              {:else if column.headerContent.type === 'html'}
                {@html column.headerContent.html}
              {/if}
            </TidyTableHeaderCell>
          {/each}
          <TidyTableHeaderCell
            class="header-cell-actions"
            {...columnSpecs.actions}
          >
            <!-- Actions -->
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}

      {#snippet body()}
        {@const itemEntries = section.items.map((item) => ({
          item,
          ctx: itemContext[item.id],
        }))}
        {#each itemEntries as { item, ctx }, i (item.id)}
          {@const itemBorderColor = item.system.rarity
            ? `var(--t5e-color-rarity-${item.system.rarity.slugify()})`
            : 'var(--t5e-color-gold)'}
          {@const showRarityBoxShadow = [
            'veryRare',
            'legendary',
            'artifact',
          ].includes(item.system.rarity)}
          <!-- TODO: Add .expanded class to the row when the item is expanded -->
          <TidyItemTableRow
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
            {#snippet children({ toggleSummary, expanded })}
              <a
                class="tidy-table-button item-use-button"
                style="--item-border-color: {itemBorderColor};"
                class:special-rarity={showRarityBoxShadow}
                onclick={(ev) => FoundryAdapter.actorTryUseItem(item, ev)}
              >
                {#if item.img?.endsWith('.svg')}
                  <Dnd5eIcon class="item-image" src={item.img} />
                {:else}
                  <img class="item-image" alt="" src={item.img} />
                {/if}
                <span class="roll-prompt">
                  <i class="fa fa-dice-d20"></i>
                </span>
              </a>
              {#if 'containerContents' in ctx && !!ctx.containerContents}
                <a
                  class="container-expander"
                  onclick={() => inlineToggleService.toggle(tabId, item.id)}
                >
                  <i
                    class="fa-solid fa-angle-right expand-indicator"
                    class:expanded={containerToggleMap.get(tabId)?.has(item.id)}
                  >
                  </i>
                </a>
              {/if}

              <TidyTableCell primary={true} class="item-label text-cell">
                <a class="item-name" onclick={(ev) => toggleSummary()}>
                  <span class="cell-name">{item.name}</span>
                  <span class="row-detail-expand-indicator">
                    <i
                      class="fa-solid fa-angle-right expand-indicator"
                      class:expanded
                    >
                    </i>
                  </span>
                </a>
              </TidyTableCell>
              {#each columns as column}
                <TidyTableCell
                  columnWidth={column.width}
                  hideUnder={column.hideUnder}
                  class={column.cellClasses}
                >
                  {#if column.cellContent.type === 'callback'}
                    {@html column.cellContent.callback?.(
                      context.document,
                      context,
                    )}
                  {:else if column.cellContent.type === 'component'}
                    <column.cellContent.component
                      rowContext={ctx}
                      rowDocument={item}
                    />
                  {/if}
                </TidyTableCell>
              {/each}
              <TidyTableCell
                class="tidy-table-actions"
                {...columnSpecs.actions}
              >
                {#if unlocked}
                  {#each itemActions as action}
                    {@const props = action.props(item)}
                    <action.component {...props} />
                  {/each}
                {/if}
                <MenuButton targetSelector="[data-item-id]" />
              </TidyTableCell>
            {/snippet}
          </TidyItemTableRow>

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
