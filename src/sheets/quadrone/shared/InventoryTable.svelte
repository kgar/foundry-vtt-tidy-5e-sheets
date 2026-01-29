<script lang="ts">
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import InlineContainerView from '../container/parts/InlineContainerView.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import type {
    Actor5e,
    CharacterItemContext,
    InventorySection,
    NpcItemContext,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { CONSTANTS } from 'src/constants';
  import TidyFredTable from 'src/components/table-quadrone/TidyFredTable.svelte';

  type Props = {
    containingDocument: any;
    editable: boolean;
    inlineToggleService: InlineToggleService;
    itemContext: Record<
      string,
      ContainerItemContext | CharacterItemContext | NpcItemContext
    >;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
    searchCriteria: string;
    section: InventorySection;
    sectionsInlineWidth: number;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    tabId: string;
    columns?: ColumnsLoadout;
  };

  let {
    containingDocument,
    editable,
    inlineToggleService,
    itemContext,
    root,
    searchCriteria,
    section,
    sectionsInlineWidth,
    sheetDocument,
    tabId,
    columns: columnsOverride,
  }: Props = $props();

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;

  const columns = $derived(
    columnsOverride ??
      new ColumnsLoadout(
        ItemColumnRuntime.getConfiguredColumnSpecifications({
          sheetType: containingDocument.type,
          tabId: tabId,
          sectionKey: section.key,
          rowActions: section.rowActions,
          section: section,
          sheetDocument: containingDocument,
        }),
      ),
  );

  const hiddenColumns = $derived(
    ItemColumnRuntime.determineHiddenColumns(sectionsInlineWidth, columns),
  );

  let containerToggleMap = $derived(inlineToggleService.map);

  const searchResults = getSearchResultsContext();
</script>

<TidyFredTable
  {section}
  entries={section.items}
  {sheetDocument}
  entryContext={context.itemContext}
  {sectionsInlineWidth}
  itemToggleMap={containerToggleMap}
  {tabId}
  {columns}
>
  {#snippet beforeImage(entry)}
    <div class="highlight"></div>
  {/snippet}

  {#snippet afterImage(entry, ctx)}
    {#if 'containerContents' in ctx && !!ctx.containerContents}
      <a
        class="container-expander"
        onclick={() => inlineToggleService.toggle(tabId, entry.id)}
      >
        <i
          class="fa-solid fa-angle-right expand-indicator"
          class:expanded={containerToggleMap.get(tabId)?.has(entry.id)}
        >
        </i>
      </a>
    {/if}
  {/snippet}

  {#snippet afterFirstCell(entry, ctx)}
    {#if ctx.attunement}
      {@const iconClass = entry.system.attuned
        ? 'fa-solid fa-sun color-text-highlight highlighted'
        : 'fa-regular fa-sun color-text-lighter'}

      {@const title = localize(ctx.attunement.title)}

      <!-- 👋 hightouch - I'm not sure on the class name, but this is a charm or indicator in a tidy table row that decorates the name column and declares a particular state that the item is in. In this case, attuned or unattuned. -->
      <i class={[iconClass, 'item-state-indicator']} data-tooltip={title}></i>
    {/if}
  {/snippet}

  {#snippet afterEntryRow(entry, ctx)}
    {#if 'containerContents' in ctx && !!ctx.containerContents}
      <InlineContainerView
        container={entry}
        containerContents={ctx.containerContents}
        {editable}
        {inlineToggleService}
        {searchCriteria}
        {sheetDocument}
      />
    {/if}
  {/snippet}
</TidyFredTable>

<TidyTable key={section.key} data-custom-section={section.custom ? true : null}>
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
              {@html column.headerContent.callback?.(context.document, context)}
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
          <a
            class={[
              'tidy-table-row-use-button',
              { disabled: !context.editable },
            ]}
            onclick={(ev) =>
              context.editable && FoundryAdapter.actorTryUseItem(item, ev)}
            data-has-roll-modes
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
                class:expanded={containerToggleMap.get(tabId)?.has(item.id)}
              >
              </i>
            </a>
          {/if}

          <TidyTableCell primary={true} class="item-label text-cell">
            <a
              class="item-name"
              role="button"
              data-keyboard-focus
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
              ? 'fa-solid fa-sun color-text-highlight highlighted'
              : 'fa-regular fa-sun color-text-lighter'}

            {@const title = localize(ctx.attunement.title)}

            <!-- 👋 hightouch - I'm not sure on the class name, but this is a charm or indicator in a tidy table row that decorates the name column and declares a particular state that the item is in. In this case, attuned or unattuned. -->
            <i class={[iconClass, 'item-state-indicator']} data-tooltip={title}
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
                {@html column.cellContent.callback?.(context.document, context)}
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
