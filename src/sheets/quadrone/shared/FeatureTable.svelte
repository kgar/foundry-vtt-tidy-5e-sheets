<script lang="ts">
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FeatureColumnRuntime } from 'src/runtime/table-columns/FeatureColumnRuntime';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    CharacterSheetQuadroneContext,
    FeatureSection,
    NpcSheetQuadroneContext,
    VehicleSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext, type Snippet } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';

  interface Props {
    section: FeatureSection;
    sheetDocument: Actor5e;
    sectionsInlineWidth: number;
    itemToggleMap: SvelteMap<string, SvelteSet<string>>;
    bodyNoEntries?: Snippet;
  }

  let {
    section,
    sheetDocument,
    sectionsInlineWidth,
    itemToggleMap,
    bodyNoEntries,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let context =
    $derived(
      getSheetContext<
        | CharacterSheetQuadroneContext
        | NpcSheetQuadroneContext
        | VehicleSheetQuadroneContext
      >(),
    );

  const rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(
      section.items,
      (entry) => context.itemContext[entry.id]?.rowActions,
    ),
  );

  let hiddenColumns = $derived(
    FeatureColumnRuntime.determineHiddenColumns(
      sectionsInlineWidth - rowActionInfo.widthPx,
      section.columns,
    ),
  );
</script>

<TidyItemTable
  {section}
  {hiddenColumns}
  {rowActionInfo}
  entries={section.items}
  entryContext={context.itemContext}
  entryToggleMap={itemToggleMap}
  {tabId}
  {bodyNoEntries}
>
  {#snippet afterFirstCell(entry)}
    {#if 'inspirationSource' in context && context.inspirationSource?.itemId === entry.id}
      <i
        class={[
          'fa-solid',
          'fa-sparkles',
          'item-state-indicator',
          'color-text-gold-emphasis',
        ]}
        data-tooltip="TIDY5E.InspirationSource.ItemIsSourceTooltip"
      ></i>
    {/if}
  {/snippet}
</TidyItemTable>
