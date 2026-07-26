<script lang="ts">
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    TidyItemSectionBase,
    Actor5e,
    CharacterItemQuadroneContext,
    NpcItemQuadroneContext,
    VehicleItemQuadroneContext,
    FeatureSection,
  } from 'src/types/types';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { FeatureColumnRuntime } from 'src/runtime/table-columns/FeatureColumnRuntime';
    import { getActorSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: FeatureSection;
    itemContext: Record<
      string,
      | CharacterItemQuadroneContext
      | NpcItemQuadroneContext
      | VehicleItemQuadroneContext
    >;
    inlineToggleService: InlineToggleService;
    sheetDocument: Actor5e | Item5e;
    sectionsInlineWidth: number;
    tabId: string;
  }

  let {
    section,
    itemContext,
    inlineToggleService,
    sheetDocument,
    sectionsInlineWidth,
    tabId,
  }: Props = $props();

  let context = $derived(getActorSheetQuadroneContext());

  let itemToggleMap = $derived(inlineToggleService.map);

  const rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(
      section.items,
      (entry) => itemContext[entry.id]?.rowActions,
      context.unlocked ? section.sectionActions : [],
    ),
  );

  // TODO: mixedItem domain
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
  entryContext={itemContext}
  entryToggleMap={itemToggleMap}
  {tabId}
>
  {#snippet subtitle(item, ctx)}
    {#if 'actionSubtitle' in ctx && ctx.actionSubtitle}
      <span class="cell-context">{@html ctx.actionSubtitle}</span>
    {/if}
  {/snippet}
</TidyItemTable>
