<script lang="ts">
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerItemContext,
    ContainerSection,
    Item5e,
  } from 'src/types/item.types';
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
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { ItemColumnRuntime } from 'src/runtime/item/ItemColumnRuntime.svelte';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';

  interface Props {
    contents: InventorySection[];
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
    contents,
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

  let configuredContents = $derived(
    SheetSections.configureInventory(
      contents.filter((i) => i.items.length),
      tabId,
      SheetPreferencesService.getByType(sheetDocument.type),
      TidyFlags.sectionConfig.get(containingDocument)?.[
        CONSTANTS.TAB_CONTAINER_CONTENTS
      ],
    ),
  );

  const searchResults = getSearchResultsContext();

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    Item5e,
    ContainerSection
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    if (unlocked) {
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

    return result;
  });

  let columnSpecs = $derived({
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + tableActions.length}) + var(--t5e-size-halfx))`,
    },
  });

  let containerToggleMap = $derived(inlineToggleService.map);

  let context = $derived(getSheetContext());

  const localize = FoundryAdapter.localize;
</script>

{#each configuredContents as section (section.key)}
  {#if section.show}
    {@const columns = ItemColumnRuntime.getSheetTabSectionColumnsQuadrone(
      containingDocument,
      tabId,
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
          {#each columns as column}
            <TidyTableHeaderCell
              class={[column.headerClasses, { hidden: !expanded && !root }]}
              columnWidth={column.width}
              hideUnder={column.hideUnder}
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
                  />
                {:else if column.headerContent.type === 'html'}
                  {@html column.headerContent.html}
                {/if}
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
                    class:expanded={containerToggleMap.get(tabId)?.has(item.id)}
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
                  {#each tableActions as action}
                    {@const props = action.props(item)}
                    <action.component {...props} />
                  {/each}
                {/if}
                <MenuButton targetSelector="[data-context-menu]" />
              </TidyTableCell>
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
