<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type {
    Actor5e,
    CharacterItemContext,
    CharacterSheetQuadroneContext,
    NpcItemContext,
    NpcSheetQuadroneContext,
    SpellbookSection,
  } from 'src/types/types';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import TidyItemTableRow from 'src/components/table-quadrone/TidyItemTableRow.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import ItemColumnRuntime from 'src/runtime/item/ItemColumnRuntime.svelte';
  import SpellSlotManagementQuadrone from '../actor/parts/SpellSlotManagementQuadrone.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { isNil } from 'src/utils/data';

  interface Props {
    sections: SpellbookSection[];
    itemContext: Record<string, CharacterItemContext | NpcItemContext>;
    inlineToggleService: InlineToggleService;
    searchCriteria: string;
    sheetDocument: Actor5e | Item5e;
  }

  let {
    sections,
    itemContext,
    inlineToggleService,
    searchCriteria,
    sheetDocument,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const searchResults = getSearchResultsContext();

  let itemToggleMap = $derived(inlineToggleService.map);

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

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

<div class="tidy-table-container" bind:this={sectionsContainer}>
  {#each sections as section (section.key)}
    {@const hasViewableItems = ItemVisibility.hasViewableItems(
      section.spells,
      searchResults.uuids,
    )}
    {#if section.show && (hasViewableItems || (context.unlocked && searchCriteria.trim() === ''))}
      {@const columns = new ColumnsLoadout(
        ItemColumnRuntime.getConfiguredColumnSpecifications(
          sheetDocument.type,
          tabId,
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
        dataset={section.dataset}
      >
        {#snippet header(expanded)}
          {@const mode = section.prepMode?.slugify()}
          {@const draggableHeaderAttributes = section.usesSlots
            ? {
                ['data-tidy-draggable']: true,
                ['data-key']: section.key,
                ['data-preparation-mode']: section.prepMode,
                ['data-level']: section.dataset['system.level'],
                ['data-slots']: true,
              }
            : {}}
          <TidyTableHeaderRow
            class={[
              'theme-dark',
              'spell-preparation',
              { [`mode-${mode}`]: !isNil(mode, '') },
            ]}
            {...draggableHeaderAttributes}
          >
            <TidyTableHeaderCell primary={true} class="header-label-cell">
              <h3>
                {localize(section.label)}
              </h3>
              <span class="table-header-count">{section.spells.length}</span>
              {#if section.usesSlots}
                <div
                  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
                >
                  <SpellSlotManagementQuadrone
                    mode={context.spellSlotTrackerMode}
                    {section}
                  />
                </div>
              {/if}
            </TidyTableHeaderCell>
            {#each columns.ordered as column}
              {@const hidden = hiddenColumns.has(column.key)}

              <TidyTableHeaderCell
                class={[column.headerClasses, { hidden }]}
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
          {@const itemEntries = section.spells.map((item) => ({
            item,
            ctx: itemContext[item.id],
          }))}
          {#each itemEntries as { item, ctx }, i (item.id)}
            {@const expanded = !!itemToggleMap.get(tabId)?.has(item.id)}

            <TidyItemTableRow
              {item}
              hidden={!searchResults.show(item.uuid)}
              rowClass={[
                {
                  expanded,
                  prepared:
                    (item.system.preparation.mode ===
                      CONSTANTS.SPELL_PREPARATION_MODE_PREPARED &&
                      item.system.preparation.prepared) ||
                    item.system.preparation.mode ===
                      CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS,
                  unprepared:
                    !item.system.linkedActivity &&
                    item.system.preparation.mode ===
                      CONSTANTS.SPELL_PREPARATION_MODE_PREPARED &&
                    !item.system.preparation.prepared,
                  ['mode-always']:
                    item.system.preparation.mode ===
                    CONSTANTS.SPELL_PREPARATION_MODE_ALWAYS,
                },
              ]}
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

                <TidyTableCell primary={true} class="item-label text-cell">
                  <a class="item-name" onclick={(ev) => toggleSummary()}>
                    <span class="cell-text">
                      <span class="cell-name">{item.name}</span>
                      {#if ctx.subtitle}
                        <span class="cell-context">{@html ctx.subtitle}</span>
                      {/if}
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
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
