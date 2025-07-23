<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActiveEffectContext,
    ActorSheetQuadroneContext,
    EffectCategory,
  } from 'src/types/types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import EffectToggleButton from 'src/components/table-quadrone/table-buttons/EffectToggleButton.svelte';
  import { getContext, type Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ItemSheetQuadroneContext } from 'src/types/item.types';
  import { EffectColumnRuntime } from 'src/runtime/tables/EffectColumnRuntime.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';

  let context =
    $derived(
      getSheetContext<ActorSheetQuadroneContext | ItemSheetQuadroneContext>(),
    );

  let effects = $derived(context.effects);

  let sections = $derived(
    Object.entries(effects).map(([k, v]) => ({
      key: k,
      ...v,
    })),
  );

  const localize = FoundryAdapter.localize;

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    ActiveEffectContext,
    EffectCategory<ActiveEffectContext> & { key: string }
  >;

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    result.push({
      component: EffectToggleButton,
      props: (args) => ({ effect: args.data.effect, doc: context.document }),
      condition: (args) =>
        context.document.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR ||
        !args.section.isEnchantment,
    } satisfies TableAction<typeof EffectToggleButton>);

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({ doc: args.data.effect }),
      } satisfies TableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: args.data.effect,
          deleteFn: () => args.data.effect.deleteDialog(),
        }),
      } satisfies TableAction<typeof DeleteButton>);
    }

    return result;
  });

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

<div bind:this={sectionsContainer}>
  {#each sections as section (section.key)}
    {@const columns = new ColumnsLoadout(
      EffectColumnRuntime.getConfiguredColumnSpecifications(
        context.document.type,
        tabId,
        section.key,
        {
          rowActions: tableActions,
        },
      ),
    )}

    {@const hiddenColumns = EffectColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth,
      columns,
    )}
    {#if !section.hidden}
      <TidyTable key={section.key}>
        {#snippet header()}
          <TidyTableHeaderRow class="theme-dark">
            <TidyTableHeaderCell primary={true} class="header-label-cell">
              <h3>
                {localize(section.label)}
              </h3>
              <span class="table-header-count">{section.effects.length}</span>
            </TidyTableHeaderCell>
            {#each columns.ordered as column}
              {@const hidden = hiddenColumns.has(column.key)}

              <TidyTableHeaderCell
                class={[column.headerClasses, { hidden }]}
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
          {@const effectEntries = section.effects.map(
            (effect: ActiveEffectContext) => ({
              effect,
            }),
          )}

          {#each effectEntries as effectContext}
            <TidyEffectTableRow effectContext={effectContext.effect}>
              {#snippet children({ toggleSummary, expanded })}
                <span class="tidy-table-row-use-button disabled">
                  <img
                    class="item-image"
                    src={effectContext.effect.img ??
                      effectContext.effect.effect.icon}
                    alt={effectContext.effect.name ?? ''}
                  />
                </span>
                <TidyTableCell primary={true}>
                  <a class="item-name" onclick={(ev) => toggleSummary()}>
                    <span class="cell-text">
                      <span class="cell-name">{effectContext.effect.name}</span>
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
                    attributes={{ ['data-tidy-column-key']: column.key }}
                  >
                    {#if column.cellContent.type === 'callback'}
                      {@html column.cellContent.callback?.(
                        context.document,
                        context,
                      )}
                    {:else if column.cellContent.type === 'component'}
                      <column.cellContent.component
                        rowContext={effectContext}
                        rowDocument={effectContext.effect.effect}
                        {section}
                      />
                    {/if}
                  </TidyTableCell>
                {/each}
              {/snippet}
            </TidyEffectTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    {/if}
  {/each}
</div>
