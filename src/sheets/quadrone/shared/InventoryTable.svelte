<script lang="ts">
  import type {
    Actor5e,
    CharacterItemQuadroneContext,
    InventorySection,
    NpcItemQuadroneContext,
  } from 'src/types/types';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';
  import { InventoryColumnRuntime } from 'src/runtime/table-columns/InventoryColumnRuntime';
  import { RowActionRuntimeBase } from 'src/runtime/table-row-actions/RowActionRuntimeBase';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  type Props = {
    containingDocument: any;
    inlineToggleService: InlineToggleService;
    itemContext: Record<
      string,
      | ContainerItemContext
      | CharacterItemQuadroneContext
      | NpcItemQuadroneContext
    >;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
    section: InventorySection;
    sectionsInlineWidth: number;
    /** The sheet which is rendering this recursive set of container contents. */
    tabId: string;
    columnsEffectiveTabId?: string;
  };

  let {
    inlineToggleService,
    itemContext,
    root,
    section,
    sectionsInlineWidth,
    tabId,
  }: Props = $props();

  let context = $derived(getSheetContext());

  let containerToggleMap = $derived(inlineToggleService.map);

  const rowActionInfo = $derived(
    RowActionRuntimeBase.getRowActionWidthInfo(
      section.items,
      (entry) => itemContext[entry.id]?.rowActions,
      context.unlocked ? section.sectionActions : [],
    ),
  );

  let hiddenColumns = $derived(
    InventoryColumnRuntime.determineHiddenColumns(
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
  entryToggleMap={containerToggleMap}
  {tabId}
  {root}
></TidyItemTable>
