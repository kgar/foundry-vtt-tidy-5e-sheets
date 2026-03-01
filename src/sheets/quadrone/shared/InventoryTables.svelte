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
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
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

  let totalItemCount = $derived(
    sections.reduce((count, s) => count + s.items.length, 0),
  );
</script>

<div class={{ ['tidy-table-container']: root }} bind:this={sectionsContainer}>
  {#if totalItemCount === 0 && root && context.editable}
    <div class="inventory-empty empty-state-container">
      <button
        type="button"
        class="button button-tertiary"
        title={localize('DND5E.ItemCreate')}
        aria-label={localize('DND5E.ItemCreate')}
        onclick={() =>
          sheetDocument.sheet._addDocument({
            tabId,
          })}
      >
        <i class="fas fa-plus"></i>
        {localize('DND5E.ItemCreate')}
      </button>
    </div>
  {:else}
    {#each sections as section (section.key)}
      {@const hasViewableItems = ItemVisibility.hasViewableItems(
        section.items,
        searchResults.uuids,
      )}
      {#if section.show && hasViewableItems}
        {@const columns = new ColumnsLoadout(
          ItemColumnRuntime.getConfiguredColumnSpecifications({
            sheetType: containingDocument.type,
            tabId: effectiveTabId,
            sectionKey: section.key,
            rowActions: section.rowActions,
            section: section,
            sheetDocument: containingDocument,
          }),
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
                  data-tidy-column-key={column.key}
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

              <TidyItemTableRow
                {item}
                hidden={!searchResults.show(item.uuid)}
                rowClass={[{ expanded }]}
                contextMenu={{
                  type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                  uuid: item.uuid,
                }}
              >
                {#snippet children({ toggleSummary, expanded })}
                  <div class="highlight"></div>
                  <!-- svelte-ignore a11y_missing_attribute -->
                  <a
                    role="button"
                    tabindex="0"
                    class={[
                      'tidy-table-row-use-button',
                      { disabled: !context.editable },
                    ]}
                    onclick={(ev) =>
                      context.editable &&
                      FoundryAdapter.actorTryUseItem(item, ev)}
                    onkeydown={(ev) =>
                      ev.key === 'Enter' ||
                      (ev.key === ' ' &&
                        context.editable &&
                        FoundryAdapter.actorTryUseItem(item, ev))}
                    data-has-roll-modes
                  >
                    <img class="item-image" alt={item.name} src={item.img} />
                    <span class="roll-prompt">
                      <i class="fa fa-dice-d20"></i>
                    </span>
                  </a>
                  {#if 'containerContents' in ctx && !!ctx.containerContents}
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                      role="button"
                      tabindex="0"
                      aria-label={localize('DND5E.ExpandCollapse')}
                      class="container-expander"
                      onclick={() => inlineToggleService.toggle(tabId, item.id)}
                      onkeydown={(ev) =>
                        ev.key === 'Enter' ||
                        (ev.key === ' ' &&
                          inlineToggleService.toggle(tabId, item.id))}
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
                    <!-- svelte-ignore a11y_missing_attribute -->
                    <a
                      aria-label={item.name}
                      class="item-name"
                      role="button"
                      data-keyboard-focus
                      tabindex="0"
                      onclick={(ev) => toggleSummary()}
                      onkeydown={(ev) =>
                        ev.key === 'Enter' ||
                        (ev.key === ' ' && toggleSummary())}
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
                      ? 'fa-solid fa-sun color-text-highlight highlighted'
                      : 'fa-regular fa-sun color-text-lighter'}

                    {@const title = localize(ctx.attunement.title)}
                    <i
                      class={[iconClass, 'item-state-indicator']}
                      data-tooltip={title}
                    ></i>
                  {:else if item.system.equipped}
                    <i
                      class="fa-solid fa-hand-fist equip-icon color-icon-theme item-state-indicator"
                      data-tooltip={localize('DND5E.Equipped')}
                    ></i>
                  {/if}
                  {#each columns.ordered as column}
                    {@const hidden = hiddenColumns.has(column.key)}

                    <TidyTableCell
                      columnWidth="{column.widthRems}rem"
                      class={[column.cellClasses, { hidden }]}
                      attributes={{ ['data-tidy-column-key']: column.key }}
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
  {/if}
</div>
