<script lang="ts">
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
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
    columns?: ColumnsLoadout;
  }

  let {
    section,
    sheetDocument,
    sectionsInlineWidth,
    itemToggleMap,
  }: Props = $props();

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );
</script>

<TidyItemTable
  {section}
  entries={section.items}
  {sheetDocument}
  entryContext={context.itemContext}
  {sectionsInlineWidth}
  entryToggleMap={itemToggleMap}
  {tabId}
  columnsV2={section.columns}
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
