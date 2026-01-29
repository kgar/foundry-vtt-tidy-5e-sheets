<script lang="ts">
  import TidyFredTable from 'src/components/table-quadrone/TidyFredTable.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    Actor5e,
    CharacterSheetQuadroneContext,
    FeatureSection,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { SvelteMap, SvelteSet } from 'svelte/reactivity';

  interface Props {
    section: FeatureSection;
    sheetDocument: Actor5e;
    sectionsInlineWidth: number;
    itemToggleMap: SvelteMap<string, SvelteSet<string>>;
    tabId?: string;
    columns?: ColumnsLoadout;
  }

  let {
    section,
    sheetDocument,
    sectionsInlineWidth,
    itemToggleMap,
    tabId: tabIdOverride,
    columns: columnsOverride,
  }: Props = $props();

  const tabId =
    tabIdOverride ?? getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let columns = $derived(
    columnsOverride ??
      new ColumnsLoadout(
        ItemColumnRuntime.getConfiguredColumnSpecifications({
          sheetType: sheetDocument.type,
          tabId: tabId,
          sectionKey: section.key,
          rowActions: section.rowActions,
          section: section,
          sheetDocument: context.document,
        }),
      ),
  );
</script>

<TidyFredTable
  {section}
  entries={section.items}
  {sheetDocument}
  entryContext={context.itemContext}
  {sectionsInlineWidth}
  {itemToggleMap}
  {tabId}
  {columns}
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
</TidyFredTable>
