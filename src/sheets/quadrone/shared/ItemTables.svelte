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
  import { getContext } from 'svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import InlineContainerView from '../container/parts/InlineContainerView.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemColumnRuntime from 'src/runtime/item/ItemColumnRuntime.svelte';

  interface Props {
    sections: InventorySection[];
    container?: Item5e;
    editable: boolean;
    itemContext: Record<string, ContainerItemContext>;
    inlineToggleService: InlineToggleService;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    unlocked?: boolean;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
  }

  let {
    sections,
    container,
    editable,
    itemContext,
    inlineToggleService,
    sheetDocument,
    unlocked = true,
    root,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let containingDocument = $derived(container ?? sheetDocument);

  let sectionsToConfigure = $derived(
    unlocked && !container ? sections : sections.filter((i) => i.items.length),
  );

  let configuredSections = $derived(
    SheetSections.configureInventory(
      sectionsToConfigure,
      tabId,
      SheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(containingDocument)?.[tabId],
    ),
  );

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
  {#each configuredSections as section (section.key)}
    {#if section.show}
      {@const columns = ItemColumnRuntime.getSheetTabSectionColumnsQuadrone(
        containingDocument,
        !container ? tabId : CONSTANTS.TAB_CONTAINER_CONTENTS,
        section,
      )}
      {@const hiddenColumns = ItemColumnRuntime.determineHiddenColumns(
        sectionsInlineWidth,
        columns,
        section,
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
              {@const width =
                typeof column.width === 'number'
                  ? column.width
                  : column.width(section)}
              <TidyTableHeaderCell
                class={[
                  column.headerClasses,
                  { hidden: (!expanded && !root) || hidden },
                ]}
                columnWidth="{width}px"
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
              rowClass={[
                FoundryAdapter.getInventoryRowClasses(
                  item,
                  itemContext[item.id]?.attunement,
                ),
                { expanded, unidentified },
              ]}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                uuid: item.uuid,
              }}
            >
              {#snippet children({ toggleSummary, expanded })}
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
                  <a class="item-name" onclick={(ev) => toggleSummary()}>
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
                {#each columns.ordered as column}
                  {@const hidden = hiddenColumns.has(column.key)}
                  {@const width =
                    typeof column.width === 'number'
                      ? column.width
                      : column.width(section)}

                  <TidyTableCell
                    columnWidth="{width}px"
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
                {sheetDocument}
                {unlocked}
              />
            {/if}
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
