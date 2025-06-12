<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemContext,
    NpcItemContext,
    TidySectionBase,
  } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import InlineContainerView from '../container/parts/InlineContainerView.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemColumnRuntime from 'src/runtime/item/ItemColumnRuntime.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';

  type ItemTableSection = TidySectionBase & { items: Item5e[] };

  interface Props {
    sections: ItemTableSection[];
    container?: Item5e;
    editable: boolean;
    itemContext: Record<
      string,
      ContainerItemContext | CharacterItemContext | NpcItemContext
    >;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
  }

  let {
    sections,
    container,
    editable,
    itemContext,
    inlineToggleService,
    searchCriteria,
    sheetDocument,
    root,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const effectiveTabId = $derived(
    container ? CONSTANTS.TAB_CONTAINER_CONTENTS : tabId,
  );

  let containingDocument = $derived(container ?? sheetDocument);

  const searchResults = getSearchResultsContext();

  let containerToggleMap = $derived(inlineToggleService.map);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let sectionsInlineWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    sectionsInlineWidth = entry.borderBoxSize[0].inlineSize;
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class={{ ['tidy-table-container']: root }} bind:this={sectionsContainer}>
  {#each sections as section (section.key)}
    {@const hasViewableItems = ItemVisibility.hasViewableItems(
      section.items,
      searchResults.uuids,
    )}
    {#if section.show && (hasViewableItems || (!container && context.unlocked && searchCriteria.trim() === ''))}
      {@const columns = new ColumnsLoadout(
        ItemColumnRuntime.getConfiguredColumnSpecifications(
          containingDocument.type,
          effectiveTabId,
          section.key,
          {
            rowActions: section.rowActions,
          },
        ),
      )}
      {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth,
        columns,
      )}
      <TidyTable
        key={section.key}
        data-custom-section={section.custom ? true : null}
      >
        {#snippet header(expanded)}
          <TidyTableHeaderRow class={{ 'theme-dark': root }}>
            <TidyTableHeaderCell primary={true} class="header-label-cell">
              <h3>
                {localize(section.label)}
              </h3>
              <span class="table-header-count">{section.items.length}</span>
            </TidyTableHeaderCell>
            {#each columns.ordered as column}
              {@const hidden = hiddenColumns.has(column.key)}

              <TidyTableHeaderCell
                class={[
                  column.headerClasses,
                  { hidden: (!expanded && !root) || hidden },
                ]}
                columnWidth="{column.widthRems}rem"
              >
                {#if !!column.headerContent}
                  {#if column.headerContent.type === 'callback'}
                    {@html column.headerContent.callback?.(
                      context.document,
                      context,
                    )}
                  {:else if column.headerContent.type === 'component'}
                    <column.headerContent.component
                      sheetContext={context}
                      sheetDocument={context.document}
                      {section}
                    />
                  {:else if column.headerContent.type === 'html'}
                    {@html column.headerContent.html}
                  {/if}
                {/if}
              </TidyTableHeaderCell>
            {/each}
          </TidyTableHeaderRow>
        {/snippet}

        {#snippet body()}
          {@const itemEntries = section.items.map((item) => ({
            item,
            ctx: itemContext[item.id],
          }))}
          {#each itemEntries as { item, ctx }, i (item.id)}
            {@const expanded = !!containerToggleMap.get(tabId)?.has(item.id)}
            {@const unidentified = item.system.identified === false}

            <TidyItemTableRow
              {item}
              hidden={!searchResults.show(item.uuid)}
              rowClass={[{ expanded, unidentified }]}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
            >
              {#snippet children({ toggleSummary, expanded })}
                <div class="highlight"></div>
                <a
                  class={['tidy-table-row-use-button']}
                  onclick={(ev) => FoundryAdapter.actorTryUseItem(item, ev)}
                >
                  <img class="item-image" alt={item.name} src={item.img} />
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
                      class:expanded={containerToggleMap
                        .get(tabId)
                        ?.has(item.id)}
                    >
                    </i>
                  </a>
                {/if}

                <TidyTableCell primary={true} class="item-label text-cell">
                  <a
                    class="item-name"
                    role="button"
                    tabindex="0"
                    onclick={(ev) => toggleSummary()}
                  >
                    <span class="cell-text">
                      <span class="cell-name">{item.name}</span>
                    </span>
                    <span class="row-detail-expand-indicator">
                      <i
                        class="fa-solid fa-angle-right expand-indicator"
                        class:expanded
                      >
                      </i>
                    </span>
                  </a>
                </TidyTableCell>
                {#if ctx.attunement}
                  {@const iconClass = item.system.attuned
                    ? 'fa-solid fa-sun color-text-gold-emphasis'
                    : 'fa-light fa-sun color-text-lighter'}

                  {@const title = ctx.attunement?.title}

                  <!-- 👋 hightouch - I'm not sure on the class name, but this is a charm or indicator in a tidy table row that decorates the name column and declares a particular state that the item is in. In this case, attuned or unattuned. -->
                  <i class={[iconClass, 'item-state-indicator']} {title}></i>
                {/if}
                {#each columns.ordered as column}
                  {@const hidden = hiddenColumns.has(column.key)}

                  <TidyTableCell
                    columnWidth="{column.widthRems}rem"
                    class={[column.cellClasses, { hidden }]}
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
                        {section}
                      />
                    {/if}
                  </TidyTableCell>
                {/each}
              {/snippet}
            </TidyItemTableRow>

            {#if 'containerContents' in ctx && !!ctx.containerContents}
              <InlineContainerView
                container={item}
                containerContents={ctx.containerContents}
                {editable}
                {inlineToggleService}
                {searchCriteria}
                {sheetDocument}
              />
            {/if}
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
