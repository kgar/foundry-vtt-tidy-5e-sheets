<script lang="ts">
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type {
    TidyItemSectionBase,
    Actor5e,
    CharacterItemQuadroneContext,
    NpcItemQuadroneContext,
    VehicleItemQuadroneContext,
  } from 'src/types/types';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';

  interface Props {
    section: TidyItemSectionBase;
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

  let itemToggleMap = $derived(inlineToggleService.map);
</script>

<TidyItemTable
  {section}
  entries={section.items}
  entryContext={itemContext}
  {sectionsInlineWidth}
  entryToggleMap={itemToggleMap}
  {tabId}
>
  {#snippet subtitle(item, ctx)}
    {#if 'actionSubtitle' in ctx && ctx.actionSubtitle}
      <span class="cell-context">{@html ctx.actionSubtitle}</span>
    {/if}
  {/snippet}
</TidyItemTable>
