<script lang="ts">
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    TidyItemSectionBase,
    Actor5e,
    CharacterItemContext,
    CharacterSheetQuadroneContext,
    NpcItemContext,
    NpcSheetQuadroneContext,
    VehicleItemContext,
  } from 'src/types/types';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import TidyFredTable from 'src/components/table-quadrone/TidyFredTable.svelte';

  interface Props {
    section: TidyItemSectionBase;
    itemContext: Record<
      string,
      CharacterItemContext | NpcItemContext | VehicleItemContext
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

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  const columns = $derived(
    new ColumnsLoadout(
      ItemColumnRuntime.getConfiguredColumnSpecifications({
        sheetType: sheetDocument.type,
        tabId: tabId,
        sectionKey: section.key,
        rowActions: section.rowActions,
        section: section,
        sheetDocument: context.actor,
      }),
    ),
  );

  let itemToggleMap = $derived(inlineToggleService.map);
</script>

<TidyFredTable
  {section}
  entries={section.items}
  {sheetDocument}
  entryContext={itemContext}
  {sectionsInlineWidth}
  {itemToggleMap}
  {tabId}
  {columns}
>
  {#snippet subtitle(item, ctx)}
    {#if 'actionSubtitle' in ctx && ctx.actionSubtitle}
      <span class="cell-context">{@html ctx.actionSubtitle}</span>
    {/if}
  {/snippet}
</TidyFredTable>
