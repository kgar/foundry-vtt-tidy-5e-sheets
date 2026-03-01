<script lang="ts">
  import InlineContainerView from '../container/parts/InlineContainerView.svelte';
  import type {
    Actor5e,
    CharacterItemContext,
    InventorySection,
    NpcItemContext,
  } from 'src/types/types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ColumnsLoadout } from 'src/runtime/item/ColumnsLoadout.svelte';
  import { ItemColumnRuntime } from 'src/runtime/tables/ItemColumnRuntime.svelte';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import TidyItemTable from 'src/components/table-quadrone/TidyItemTable.svelte';

  type Props = {
    containingDocument: any;
    editable: boolean;
    inlineToggleService: InlineToggleService;
    itemContext: Record<
      string,
      ContainerItemContext | CharacterItemContext | NpcItemContext
    >;
    /** Denotes whether this layer of nested tables is the root (top) layer. This affects what styles go into effect. */
    root?: boolean;
    searchCriteria: string;
    section: InventorySection;
    sectionsInlineWidth: number;
    /** The sheet which is rendering this recursive set of container contents. */
    sheetDocument: Actor5e | Item5e;
    tabId: string;
    columnsEffectiveTabId?: string;
    columns?: ColumnsLoadout;
  };

  let {
    containingDocument,
    editable,
    inlineToggleService,
    itemContext,
    root,
    searchCriteria,
    section,
    sectionsInlineWidth,
    sheetDocument,
    tabId,
    columnsEffectiveTabId,
    columns: columnsOverride,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  const columns = $derived(
    columnsOverride ??
      new ColumnsLoadout(
        ItemColumnRuntime.getConfiguredColumnSpecifications({
          sheetType: containingDocument.type,
          tabId: columnsEffectiveTabId ?? tabId,
          sectionKey: section.key,
          rowActions: section.rowActions,
          section: section,
          sheetDocument: containingDocument,
        }),
      ),
  );

  let containerToggleMap = $derived(inlineToggleService.map);
</script>

<TidyItemTable
  {section}
  entries={section.items}
  {sheetDocument}
  entryContext={itemContext}
  {sectionsInlineWidth}
  entryToggleMap={containerToggleMap}
  {tabId}
  {columns}
  {root}
>
  {#snippet subtitle(_item, ctx)}
    {#if root && ctx.containerName}
      <span class="cell-context">{@html ctx.containerName}</span>
    {:else if ctx.subtitle}
      <span class="cell-context">{@html ctx.subtitle}</span>
    {/if}
  {/snippet}

  {#snippet beforeImage(entry)}
    <div class="highlight"></div>
  {/snippet}

  {#snippet afterImage(entry, ctx)}
    {#if 'containerContents' in ctx && !!ctx.containerContents}
      <!-- svelte-ignore a11y_missing_attribute -->
      <a
        class="container-expander"
        onclick={() => inlineToggleService.toggle(tabId, entry.id)}
        role="button"
        tabindex="0"
        aria-label={localize('DND5E.ExpandCollapse')}
        onkeydown={(ev) =>
          ev.key === 'Enter' ||
          (ev.key === ' ' && inlineToggleService.toggle(tabId, entry.id))}
      >
        <i
          class="fa-solid fa-angle-right expand-indicator"
          class:expanded={containerToggleMap.get(tabId)?.has(entry.id)}
        >
        </i>
      </a>
    {/if}
  {/snippet}

  {#snippet afterFirstCell(entry, ctx)}
    {#if ctx.attunement}
      {@const iconClass = entry.system.attuned
        ? 'fa-solid fa-sun color-text-highlight highlighted'
        : 'fa-regular fa-sun color-text-lighter'}

      {@const title = localize(ctx.attunement.title)}
      <i class={[iconClass, 'item-state-indicator']} data-tooltip={title}></i>
    {:else if entry.system.equipped}
      <i
        class="fa-solid fa-hand-fist equip-icon color-icon-theme item-state-indicator"
        data-tooltip={localize('DND5E.Equipped')}
      ></i>
    {/if}
  {/snippet}

  {#snippet afterEntryRow(entry, ctx)}
    {#if 'containerContents' in ctx && !!ctx.containerContents}
      <InlineContainerView
        container={entry}
        containerContents={ctx.containerContents}
        {editable}
        {inlineToggleService}
        {searchCriteria}
        {sheetDocument}
      />
    {/if}
  {/snippet}
</TidyItemTable>
